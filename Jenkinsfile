pipeline {
    agent any

    environment {
        PRISMA_CLI_BINARY_TARGETS = "native"
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
                    sh 'npm install'
                }
            }
        }

        stage('Generate Prisma') {
            steps {
                dir('app') {
                    sh '''
                    npm install prisma @prisma/client
                    npx prisma generate --no-engine
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                dir('app') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                dir('app') {
                    sh '''
                    pm2 stop eng-lens || true
                    pm2 start npm --name eng-lens -- start
                    pm2 save
                    '''
                }
            }
        }
    }
}
