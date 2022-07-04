variable "registry" {
  default = "public.ecr.aws/j5v8s8v8"
}

variable "context" {
  default = "."
}

target "pod" {
  dockerfile = "Containerfile"
  context = "${context}"
  tags = ["${registry}/pod"]
  args = {
    crate = "shuttle-pod"
  }
}

target "provisioner" {
  dockerfile = "Containerfile"
  context = "${context}"
  tags = ["${registry}/provisioner"]
  args = {
    crate = "shuttle-provisioner"
  }
}
