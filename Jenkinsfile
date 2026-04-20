pipeline {
    agent any

    environment {
        NODE_ENV = "production"

        // Prisma CI stability fixes
        PRISMA_CLI_BINARY_TARGETS = "debian-openssl-3.0.x"
        PRISMA_SKIP_POSTINSTALL_GENERATE = "true"
        PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING = "1"

        // Helps memory stability in Jenkins
        NODE_OPTIONS = "--max-old-space-size=4096"
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

                        echo "Installing Prisma (stable v5)..."
                        npm install prisma@5 @prisma/client@5

                        echo "Generating Prisma Client..."
                        npx prisma generate
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

        stage('Post Build Check') {
            steps {
                echo "Build completed successfully"
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
