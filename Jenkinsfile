pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Vaishnavikathar/eng-lens.git'
            }
        }

        stage('Clean Workspace') {
            steps {
                dir('app') {
                    sh '''
                        rm -rf node_modules package-lock.json .next
                    '''
                }
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

        stage('Start Application (Test Run)') {
            steps {
                dir('app') {
                    sh '''
                        nohup npm start > app.log 2>&1 &
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build & Deployment Successful"
        }

        failure {
            echo "❌ Build Failed — Check Logs"
        }
    }
}
