pipeline {
  agent any

  environment {
    NODE_ENV = "production"
  }

  stages {

    stage('Checkout') {
      steps {
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

    stage('Build') {
      steps {
        dir('app') {
          sh 'npm run build'
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
      echo "❌ Pipeline Failed"
    }
  }
}
