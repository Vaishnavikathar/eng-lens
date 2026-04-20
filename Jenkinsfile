pipeline {
    agent any

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
                    sh 'npm install prisma @prisma/client'
                    sh 'npx prisma generate'
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
                    pm2 start npm --name "eng-lens" -- start
                    pm2 save
                    '''
                }
            }
        }
    }
}
