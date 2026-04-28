// Jenkinsfile
pipeline {
    agent any

    environment {
        IMAGE_NAME    = "eng-lens"
        CONTAINER_NAME = "eng-lens-app"
        APP_PORT      = "3000"
        HOST_PORT     = "80"
    }

    stages {

        stage('📥 Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Vaishnavikathar/eng-lens.git'
            }
        }

        stage('🔍 Lint & Type Check') {
            steps {
                dir('app') {
                    sh 'npm ci'
                    sh 'npx prisma generate'
                    sh 'npx tsc --noEmit --skipLibCheck'
                }
            }
        }

        stage('🐳 Build Docker Image') {
            steps {
                sh '''
                    docker build -t $IMAGE_NAME:$BUILD_NUMBER .
                    docker tag $IMAGE_NAME:$BUILD_NUMBER $IMAGE_NAME:latest
                '''
            }
        }

        stage('🗄️ Run DB Migrations') {
            steps {
                withCredentials([string(credentialsId: 'GEMINI_API_KEY', variable: 'GEMINI_KEY')]) {
                    sh '''
                        docker run --rm \
                          -e DATABASE_URL="file:./prisma/dev.db" \
                          -e GEMINI_API_KEY=$GEMINI_KEY \
                          $IMAGE_NAME:latest \
                          npx prisma migrate deploy
                    '''
                }
            }
        }

        stage('🚀 Deploy') {
            steps {
                withCredentials([string(credentialsId: 'GEMINI_API_KEY', variable: 'GEMINI_KEY')]) {
                    sh '''
                        # Stop & remove old container if running
                        docker stop $CONTAINER_NAME || true
                        docker rm   $CONTAINER_NAME || true

                        # Start new container
                        docker run -d \
                          --name $CONTAINER_NAME \
                          --restart always \
                          -p $HOST_PORT:$APP_PORT \
                          -e DATABASE_URL="file:./prisma/dev.db" \
                          -e GEMINI_API_KEY=$GEMINI_KEY \
                          -v eng-lens-db:/app/prisma \
                          $IMAGE_NAME:latest
                    '''
                }
            }
        }

        stage('🧹 Cleanup Old Images') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful! App is live.'
        }
        failure {
            echo '❌ Pipeline failed. Check logs above.'
        }
    }
}
