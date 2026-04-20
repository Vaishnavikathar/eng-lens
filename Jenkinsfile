pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Vaishnavikathar/eng-lens.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('app') {
                    sh '''
                    npm install
                    '''
                }
            }
        }

        stage('Generate Prisma Client') {
            steps {
                dir('app') {
                    sh '''
                    npx prisma generate
                    '''
                }
            }
        }

        stage('Build Next.js App') {
            steps {
                dir('app') {
                    sh '''
                    npm run build
                    '''
                }
            }
        }

        stage('Test (Optional)') {
            steps {
                dir('app') {
                    sh '''
                    echo "No tests configured"
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                dir('app') {
                    sh '''
                    echo "Stopping old process if running..."
                    pm2 stop eng-lens || true

                    echo "Starting new build..."
                    pm2 start npm --name eng-lens -- start || pm2 restart eng-lens

                    pm2 save
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build and Deployment Successful!'
        }

        failure {
            echo '❌ Pipeline Failed. Check logs.'
        }
    }
}
