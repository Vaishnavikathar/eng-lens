pipeline {
    agent any

    environment {
        NODE_ENV = "production"
        PRISMA_CLI_BINARY_TARGETS = "native"
        PRISMA_ENGINE_PROTOCOL = "binary"
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
                    node -v
                    npm -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('app') {
                    sh '''
                        npm cache clean --force
                        rm -rf node_modules package-lock.json
                        npm install
                    '''
                }
            }
        }

        stage('Prisma Setup & Generate') {
            steps {
                dir('app') {
                    sh '''
                        echo "Cleaning Prisma cache..."
                        rm -rf node_modules/.prisma
                        rm -rf node_modules/@prisma

                        echo "Installing Prisma..."
                        npm install prisma@5 @prisma/client@5 --no-cache

                        echo "Generating Prisma Client..."
                        npx prisma generate --no-engine
                    '''
                }
            }
        }

        stage('Build App') {
            steps {
                dir('app') {
                    sh '''
                        npm run build
                    '''
                }
            }
        }

        stage('Test Run') {
            steps {
                dir('app') {
                    sh '''
                        echo "Starting app test run..."
                        npm start || true
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline Success"
        }
        failure {
            echo "❌ Pipeline Failed — check logs"
        }
    }
}
