pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Vaishnavikathar/eng-lens.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('app') {
                    sh 'npm install'
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

        stage('Start App') {
            steps {
                dir('app') {
                    sh 'pm2 restart eng-lens || pm2 start npm --name eng-lens -- start'
                }
            }
        }
    }
}
