pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Vaishnavikathar/eng-lens.git'
            }
        }

        stage('Verify Node') {
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
                    sh 'npm install'
                }
            }
        }

        stage('Prisma Generate') {
            steps {
                dir('app') {
                    sh 'npx prisma generate'
                }
            }
        }

        stage('Build App') {
            steps {
                dir('app') {
                    sh 'npm run build'
                }
            }
        }

        stage('Run (Test)') {
            steps {
                dir('app') {
                    sh 'nohup npm start > app.log 2>&1 &'
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful"
        }
        failure {
            echo "❌ Build Failed"
        }
    }
}
