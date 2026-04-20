pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Vaishnavikathar/eng-lens.git'
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                pm2 restart eng-lens || pm2 start npm --name "eng-lens" -- start
                '''
            }
        }
    }
}
