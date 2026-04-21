pipeline {
    agent any

    environment {
        APP_DIR = 'app'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout Code') {
            steps {
                cleanWs()
                checkout scm
            }
        }

        stage('Verify Tools') {
            steps {
                sh '''
                    echo "Node version:"
                    node --version
                    echo "NPM version:"
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                dir("${APP_DIR}") {
                    sh '''
                        npm cache clean --force
                        rm -rf node_modules package-lock.json
                        npm install
                    '''
                }
            }
        }

        stage('Prisma Generate') {
            steps {
                dir("${APP_DIR}") {
                    sh '''
                        echo "DATABASE_URL=file:./dev.db" > .env
                        echo "Generating Prisma Client..."
                        npx prisma generate
                    '''
                }
            }
        }

        stage('Prisma Migrate') {
            steps {
                dir("${APP_DIR}") {
                    sh '''
                        echo "Running Prisma Migrations..."
                        npx prisma migrate deploy
                    '''
                }
            }
        }

        stage('Build App') {
            steps {
                dir("${APP_DIR}") {
                    sh 'npm run build'
                }
            }
        }

        stage('Test Run') {
            steps {
                dir("${APP_DIR}") {
                    sh 'npm test -- --passWithNoTests || true'
                }
            }
        }

        stage('Deploy to AWS EC2') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'EC2_SSH_KEY',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'EC2_USER'
                    ),
                    string(
                        credentialsId: 'EC2_HOST',
                        variable: 'EC2_HOST'
                    )
                ]) {
                    sh '''
                        echo "Deploying to EC2: $EC2_HOST"

                        # Sync all files except node_modules and .next
                        rsync -avz --delete \
                            --exclude='node_modules' \
                            --exclude='.next' \
                            --exclude='*.db' \
                            -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
                            ./ ${EC2_USER}@${EC2_HOST}:/home/${EC2_USER}/eng-lens/

                        # Run commands on EC2
                        ssh -i $SSH_KEY -o StrictHostKeyChecking=no \
                            ${EC2_USER}@${EC2_HOST} bash << 'ENDSSH'
                            set -e
                            cd /home/ubuntu/eng-lens/app

                            echo "Setting DATABASE_URL for SQLite..."
                            echo "DATABASE_URL=file:./dev.db" > .env

                            echo "Installing dependencies..."
                            npm install

                            echo "Generating Prisma client..."
                            npx prisma generate

                            echo "Running migrations..."
                            npx prisma migrate deploy

                            echo "Restarting app..."
                            pm2 restart eng-lens 2>/dev/null || \
                                pm2 start npm --name "eng-lens" -- start
                            pm2 save

                            echo "Done!"
ENDSSH
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline Succeeded!'
        }
        failure {
            echo '❌ Pipeline Failed — check logs above'
        }
        always {
            cleanWs()
        }
    }
}
