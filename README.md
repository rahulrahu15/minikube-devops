# Kubernetes Weather Microservices Platform ☁️🌦️

![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker\&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes\&logoColor=white)
![ArgoCD](https://img.shields.io/badge/ArgoCD-EF7B4D?logo=argo\&logoColor=white)
![Helm](https://img.shields.io/badge/Helm-0F1689?logo=helm\&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?logo=prometheus\&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?logo=grafana\&logoColor=white)

A **production-style DevOps project** demonstrating containerization, Kubernetes orchestration, GitOps deployments, Blue-Green strategy, autoscaling, and full observability.

---

# 1. Project Overview

The **Kubernetes Weather Microservices Platform** is a cloud-native microservices application that retrieves real-time weather data from the OpenWeather API.

The project demonstrates a **complete DevOps lifecycle**, including:

* Containerized microservices
* Kubernetes-based orchestration
* CI/CD automation
* Blue-Green deployments
* Horizontal Pod Autoscaling
* Observability using Prometheus and Grafana

---

# 2. Architecture

```
Developer
   │
   ▼
GitHub Repository
   │
   ▼
GitHub Actions (CI)
   │
   ├── Build Docker Images
   ├── Authenticate with DockerHub
   └── Push Images to DockerHub
   │
   ▼
DockerHub Registry
   │
   ▼
Argo CD (GitOps Continuous Delivery)
   │
   ▼
Kubernetes Cluster (Minikube)
   │
   ├── Frontend Pods (Blue / Green)
   ├── Backend API Pods
   │
   ▼
Nginx Ingress Controller
   │
   ▼
weather.local
```

Monitoring Stack:

```
Kubernetes Cluster
      │
      ▼
Prometheus (metrics collection)
      │
      ▼
Grafana (visualization dashboards)
```

---

# 3. Tech Stack

### Application

Backend

* Python Flask

Frontend

* HTML
* CSS
* JavaScript

### DevOps & Infrastructure

Containerization

* Docker

Orchestration

* Kubernetes
* Minikube

CI/CD

* GitHub Actions
* Argo CD (GitOps deployment)

Networking

* Nginx Ingress Controller

Monitoring

* Prometheus
* Grafana

Package Manager

* Helm (used to install monitoring stack)

External API

* OpenWeather API

---

# 4. Features Implemented

* Dockerized microservices
* Kubernetes deployments and services
* Blue-Green deployment strategy
* Horizontal Pod Autoscaler (HPA)
* GitOps Continuous Delivery
* Ingress-based routing using custom domain
* Monitoring with Prometheus and Grafana
* Load testing using curl loops
* Pod failure testing and automatic recovery
* CPU usage visualization
* Blue vs Green pod monitoring in Grafana

---

# 5. Kubernetes Components

Deployments

* frontend-blue deployment
* frontend-green deployment
* backend deployment

Services

* frontend service
* backend service

Ingress

* Nginx ingress routing traffic to frontend

Autoscaling

* Horizontal Pod Autoscaler (HPA)

Monitoring

* Prometheus installed via Helm
* Grafana dashboards

---

# 6. Blue-Green Deployment Strategy

Blue-Green deployment allows safe production releases by maintaining two application environments.

Blue Environment
Current production version.

Green Environment
New version deployed for testing before switching traffic.

Benefits:

* Zero downtime deployment
* Easy rollback
* Safe release validation

Prometheus query used to visualize Blue vs Green pods in Grafana:

```
count(
  label_replace(
    kube_pod_info{namespace="default", pod=~"frontend-(blue|green).*"},
    "color",
    "$1",
    "pod",
    "frontend-(blue|green).*"
  )
) by (color)
```

---

# 7. Horizontal Pod Autoscaling

Horizontal Pod Autoscaler automatically scales pods based on CPU utilization.

Example configuration:

```
kubectl autoscale deployment frontend-blue \
  --cpu-percent=50 \
  --min=1 \
  --max=5
```

Verification:

```
kubectl get hpa -w
```

During load testing:

* CPU utilization increases
* HPA automatically creates additional pods
* Traffic is distributed across pods

---

# 8. Load Testing

Traffic simulation using curl loops.

```
while true; do curl http://weather.local; done
```

Observed results:

* Increased CPU usage
* Horizontal Pod Autoscaler triggered
* Additional pods created automatically

---

# 9. CI/CD Pipeline

Continuous Integration is implemented using **GitHub Actions**.

Workflow:

```
Developer pushes code to GitHub
        │
        ▼
GitHub Actions CI Pipeline
        │
        ├── Build Docker images
        ├── Login to DockerHub
        └── Push images to DockerHub
        │
        ▼
DockerHub Registry
        │
        ▼
Argo CD monitors Kubernetes manifests in Git
        │
        ▼
Kubernetes cluster syncs to desired state
```

The CI pipeline automatically builds and pushes:

* frontend-blue image
* frontend-green image
* backend image

Secrets used in CI pipeline:

* DOCKERHUB_USERNAME
* DOCKERHUB_TOKEN
* OPENWEATHER_API_KEY

---

# 10. Monitoring and Observability

Monitoring stack installed using Helm.

Tools used:

Prometheus
Collects Kubernetes metrics such as:

* CPU usage
* Pod information
* resource utilization

Grafana
Provides visualization dashboards for:

* CPU metrics
* Pod monitoring
* Blue vs Green deployment visualization

Example CPU monitoring query:

```
sum(rate(container_cpu_usage_seconds_total{pod=~"frontend.*"}[5m])) by (pod)
```

---

# 11. Failure Simulation

Pod resilience testing:

```
kubectl delete pod <pod-name>
```

Kubernetes automatically recreates the pod.

Manual scaling test:

```
kubectl scale deployment frontend-blue --replicas=3
```

Cluster health verified using:

```
kubectl get pods
kubectl get hpa
```

---

# 12. Project Structure

```
weather-project
│
├── frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend
│   └── app.py
│
├── docker
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
│
├── kubernetes
│   ├── frontend-blue-deployment.yaml
│   ├── frontend-green-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── services.yaml
│   ├── ingress.yaml
│   └── hpa.yaml
│
├── .github/workflows
│   └── ci-cd.yaml
│
└── README.md
```

---

# 13. Screenshots

Add project screenshots here.

Examples:

Argo CD Application Sync

```
![ArgoCD](images/argocd-dashboard.png)
```

Grafana CPU Monitoring

```
![Grafana CPU](images/grafana-cpu.png)
```

Blue-Green Pod Visualization

```
![Blue Green Pods](images/grafana-blue-green.png)
```

Autoscaling Dashboard

```
![HPA Scaling](images/hpa-scaling.png)
```

---

# 14. How to Run the Project

Start Minikube

```
minikube start
```

Enable ingress

```
minikube addons enable ingress
```

Deploy Kubernetes resources

```
kubectl apply -f kubernetes/
```

Install monitoring stack

```
helm install monitoring prometheus-community/kube-prometheus-stack
```

Verify pods

```
kubectl get pods
```

Access application

```
http://weather.local
```

---

# 15. Future Improvements

Possible enhancements:

* Canary deployments
* Kubernetes Secrets for API keys
* Centralized logging with ELK stack
* Cloud deployment (AWS / GCP)

---

# 16. Author

Rahul

DevOps Engineer | Cloud & Kubernetes Enthusiast

GitHub
https://github.com/rahulrahu15

---

⭐ If you found this project useful, consider giving the repository a star.
