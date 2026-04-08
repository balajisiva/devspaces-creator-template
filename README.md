# OpenShift DevSpaces Devfile Creator

A comprehensive Backstage Software Template that creates customized DevSpaces workspaces with dynamic devfile generation.

## Overview

This Backstage template provides an interactive form-based experience to create development workspaces in OpenShift DevSpaces. Instead of manually writing devfiles, users can select their preferences through a UI, and the template generates a fully-configured workspace.

## Features

✨ **Multiple Technology Stacks**
- Node.js, React, Angular, Vue.js
- Java Spring Boot
- Python Django
- Go
- .NET Core

🗄️ **Database Support**
- PostgreSQL
- MySQL
- MongoDB
- Redis

⚙️ **Additional Services**
- RabbitMQ
- Apache Kafka
- Elasticsearch

🎯 **Smart Configuration**
- Dynamic devfile generation based on user selections
- Customizable resource limits (CPU, Memory)
- Persistent storage options
- Auto-start capabilities
- Multiple port configurations

🔧 **Backstage Integration**
- Custom scaffolder action for DevSpaces
- Automatic repository creation
- Catalog registration
- Direct workspace launch links

## Quick Start

### For Template Users

1. Go to your Backstage instance
2. Click **Create** → **OpenShift DevSpaces Workspace Creator**
3. Fill in the form with your preferences
4. Click **Create**
5. Your workspace will be ready in DevSpaces!

### For Backstage Administrators

See [SETUP.md](./SETUP.md) for complete installation instructions.

**Quick Install:**

```bash
# 1. Clone this repository
git clone <this-repo-url>

# 2. Register the template in Backstage
# Add to app-config.yaml:
catalog:
  locations:
    - type: url
      target: https://github.com/your-org/devspaces-devfile-creator-template/blob/main/template.yaml

# 3. Install custom actions
cd custom-actions
npm install
npm run build
cp -r . /path/to/backstage/packages/backend/src/plugins/scaffolder/actions/devspaces

# 4. Restart Backstage
```

## What Gets Generated

When you create a workspace using this template, you get:

```
generated-project/
├── devfile.yaml          # Customized DevSpaces configuration
├── catalog-info.yaml     # Backstage catalog entry
└── README.md            # Project documentation with setup instructions
```

### Example Devfile

For a Node.js project with PostgreSQL:

```yaml
schemaVersion: 2.2.0
metadata:
  name: my-app
  displayName: My Application
components:
  - name: dev-container
    container:
      image: registry.redhat.io/devspaces/udi-rhel8:latest
      memoryLimit: 2Gi
      cpuLimit: 1000m
      endpoints:
        - name: application
          targetPort: 3000
          exposure: public
  - name: postgres
    container:
      image: postgres:15-alpine
      env:
        - name: POSTGRES_DB
          value: myapp_dev
commands:
  - id: install
    exec:
      commandLine: npm install
  - id: run
    exec:
      commandLine: npm run dev
```

## Template Structure

```
devspaces-devfile-creator-template/
├── template.yaml              # Backstage template definition
│                             # - Input parameters
│                             # - Scaffolder steps
│                             # - Output configuration
│
├── skeleton/                  # Template files (Nunjucks templates)
│   ├── devfile.yaml          # Dynamic devfile with conditionals
│   ├── catalog-info.yaml     # Backstage catalog entry
│   └── README.md             # Generated project README
│
├── custom-actions/            # Custom Backstage scaffolder actions
│   ├── devspaces/
│   │   └── createWorkspace.ts  # DevSpaces API integration
│   ├── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── SETUP.md                   # Installation guide for admins
└── README.md                  # This file
```

## Customization Examples

### Adding a New Technology Stack

**1. Update `template.yaml`:**

```yaml
techStack:
  enum:
    - nodejs
    - rust  # Add new option
  enumNames:
    - 'Node.js'
    - 'Rust'  # Display name
```

**2. Update `skeleton/devfile.yaml`:**

```yaml
{% if values.techStack == 'rust' -%}
- name: CARGO_HOME
  value: /projects/.cargo
{% endif -%}
```

### Adding a New Database

```yaml
# In template.yaml
databaseType:
  enum:
    - postgresql
    - cassandra  # New option

# In skeleton/devfile.yaml
{% if values.databaseType == 'cassandra' %}
- name: cassandra
  container:
    image: cassandra:4
    endpoints:
      - name: cassandra
        targetPort: 9042
{% endif %}
```

## How It Works

1. **User Input**: Interactive form collects preferences
2. **Template Processing**: Nunjucks processes skeleton files with user values
3. **Repository Creation**: Files pushed to GitHub
4. **Catalog Registration**: Component registered in Backstage
5. **Workspace Creation**: (Optional) Automatically creates DevSpaces workspace

## Configuration Options

### Technology Stacks

| Stack | Language | Default Port | Package Manager |
|-------|----------|--------------|-----------------|
| Node.js | JavaScript/TypeScript | 3000 | npm |
| Java Spring | Java | 8080 | Maven |
| Python Django | Python | 8000 | pip |
| Go | Go | 8080 | go modules |
| .NET Core | C# | 5000 | dotnet |
| React | TypeScript | 3000 | npm |
| Angular | TypeScript | 4200 | npm |
| Vue.js | JavaScript | 8080 | npm |

### Resource Presets

| Preset | Memory | CPU | Use Case |
|--------|--------|-----|----------|
| Small | 1Gi | 500m | Simple apps, testing |
| Medium | 2Gi | 1000m | Most applications |
| Large | 4Gi | 2000m | Heavy builds, monorepos |
| XLarge | 8Gi | 4000m | Complex full-stack apps |

## Advanced Features

### Persistent Storage

Enable persistent volumes for:
- Package manager caches (npm, Maven, pip)
- node_modules, dependencies
- Database data
- Custom application data

### Auto-Start

Configure workspace to automatically:
- Install dependencies
- Run database migrations
- Start development server
- Open specific files/editors

### Custom Commands

Pre-defined commands for:
- Building
- Running (dev/prod)
- Testing
- Linting
- Debugging
- Database operations

## Use Cases

### 1. Onboarding New Developers

Instead of lengthy setup docs, new developers can:
- Select the project template
- Get a fully-configured workspace
- Start coding immediately

### 2. Standardizing Development Environments

Ensure all team members use:
- Same base images
- Same tool versions
- Same configuration
- Same resource limits

### 3. Multi-Stack Projects

Create different workspaces for:
- Frontend (React/Vue/Angular)
- Backend (Node.js/Java/Python)
- Data services (with databases)
- Full-stack (combined)

### 4. Training and Workshops

Quickly provision workspaces for:
- Coding bootcamps
- Internal training
- Conference workshops
- Educational content

## Best Practices

✅ **DO:**
- Start with smaller resource limits and increase as needed
- Use persistent storage for caches to speed up rebuilds
- Enable auto-start for better UX
- Choose the right base image for your stack
- Use secrets for sensitive data

❌ **DON'T:**
- Hardcode credentials in devfiles
- Use excessive resource limits
- Skip testing generated devfiles
- Ignore security scanning of images
- Over-engineer the initial setup

## Troubleshooting

See [SETUP.md](./SETUP.md#troubleshooting) for detailed troubleshooting steps.

**Common Issues:**
- Template not appearing → Check catalog registration
- Workspace fails to start → Validate devfile syntax
- Out of resources → Check cluster quotas
- Slow startup → Enable persistent storage for caches

## Contributing

Contributions welcome! Please:

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Resources

- 📚 [Backstage Documentation](https://backstage.io/docs)
- 📚 [Devfile Specification](https://devfile.io/docs/2.2.0)
- 📚 [OpenShift DevSpaces Docs](https://developers.redhat.com/products/openshift-dev-spaces)
- 📚 [Software Templates Guide](https://backstage.io/docs/features/software-templates)

## License

Apache-2.0

## Support

- 🐛 Report Issues
- 💬 Discussions
- 📧 Contact: platform-team@example.com
