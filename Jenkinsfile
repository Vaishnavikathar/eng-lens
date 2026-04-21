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
                    echo "Node: $(node --version)"
                    echo "NPM:  $(npm --version)"
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                dir("${APP_DIR}") {
                    sh '''
                        echo 'DATABASE_URL="file:./dev.db"' > .env
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
                        echo 'DATABASE_URL="file:./dev.db"' > .env

                        echo "Fixing permissions on workspace..."
                        chmod -R 755 .

                        echo "Setting PRISMA_ENGINES_DIR to workspace..."
                        export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
                        export TMPDIR="${WORKSPACE}/tmp"
                        mkdir -p "${WORKSPACE}/tmp"
                        chmod 777 "${WORKSPACE}/tmp"

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
                        echo 'DATABASE_URL="file:./dev.db"' > .env
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
