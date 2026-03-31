# Kubernetes Weather Microservices Platform ☁️🌦️

![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker\&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes\&logoColor=white)
![ArgoCD](https://img.shields.io/badge/ArgoCD-EF7B4D?logo=argo\&logoColor=white)
![Helm](https://img.shields.io/badge/Helm-0F1689?logo=helm\&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?logo=prometheus\&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?logo=grafana\&logoColor=white)

Designed and implemented a production-style cloud-native microservices platform using Kubernetes, incorporating GitOps-based continuous delivery, Blue-Green deployments, autoscaling, and full observability.

The system automates the complete DevOps lifecycle — from container build and registry push using CI pipelines to declarative deployment and synchronization using Argo CD — ensuring zero manual intervention and consistent cluster state management.

---

# 1. Project Overview

The Kubernetes Weather Microservices Platform is a cloud-native application designed to simulate a real-world DevOps production environment.

This project demonstrates:

* End-to-end CI/CD automation
* GitOps-based deployments using ArgoCD
* Blue-Green deployment strategy for zero-downtime releases
* Horizontal Pod Autoscaling for dynamic scaling
* Observability stack with Prometheus and Grafana

👉 The system ensures:

* Fully automated deployments
* Zero manual cluster intervention
* High availability and scalability

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
ArgoCD continuously monitors the Git repository and reconciles the Kubernetes cluster state with the desired configuration, ensuring Git remains the single source of truth.
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

Blue-Green deployment allows safe production releases by maintaining two application environments. Traffic switching between Blue and Green environments is managed declaratively via Kubernetes Service selectors. In a GitOps workflow, this switching is triggered by updating configuration in Git, which is automatically applied to the cluster by ArgoCD.

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

Continuous Integration is implemented using **GitHub Actions**. Continuous Delivery is implemented using a GitOps model, where ArgoCD automatically applies Kubernetes manifests from the Git repository instead of manual kubectl operations.

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

* Canary deployments using Istio
* GitOps rollback strategies using ArgoCD
* Deployment on managed Kubernetes (EKS/GKE)
* Centralized logging using ELK stack

---

# 16. Author

Rahul

DevOps Engineer | Cloud & Kubernetes Enthusiast

GitHub
https://github.com/rahulrahu15

---

⭐ If you found this project useful, consider giving the repository a star.
