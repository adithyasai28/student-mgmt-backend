terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
      version = "~> 2.24.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "student_img" {
  name = "yourusername/student-mgmt-backend:1.0.0"
  keep_locally = true
}

resource "docker_container" "student_container" {
  name  = "student-mgmt-terraform"
  image = docker_image.student_img.latest
  ports {
    internal = 3000
    external = 3000
  }
  env = ["PORT=3000"]
}
