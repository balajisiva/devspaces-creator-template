# DevSpaces Devfile Creator - Setup Guide

This guide explains how to integrate this devfile creator template into your Backstage instance.

## Overview

This template allows users to create customized DevSpaces workspaces through Backstage's Software Templates feature. It includes:

- **Interactive form** with multiple technology stack options
- **Dynamic devfile generation** based on user selections
- **Custom scaffolder action** to create DevSpaces workspaces
- **Support for multiple languages**: Node.js, Java, Python, Go, .NET
- **Database options**: PostgreSQL, MySQL, MongoDB, Redis
- **Additional services**: RabbitMQ, Kafka, Elasticsearch

## Directory Structure

```
devspaces-devfile-creator-template/
├── template.yaml              # Backstage template definition
├── skeleton/                  # Template files
│   ├── devfile.yaml          # DevSpaces devfile template
│   ├── catalog-info.yaml     # Backstage catalog entry
│   └── README.md             # Generated project README
├── custom-actions/            # Custom Backstage actions
│   ├── devspaces/
│   │   ├── createWorkspace.ts
│   │   └── index.ts
│   ├── index.ts
│   ├── package.json
│   └── tsconfig.json
├── SETUP.md                   # This file
└── README.md                  # Template documentation
```

## Prerequisites

1. **Backstage instance** (v1.20.0 or later)
2. **OpenShift DevSpaces** cluster with accessible URL
3. **GitHub** or other Git provider configured in Backstage
4. **Node.js** 18+ (for building custom actions)

## Installation Steps

### Step 1: Add Template to Backstage Catalog

#### Option A: Register via URL (Recommended)

1. Push this template to a Git repository
2. In Backstage, go to **Create** > **Register Existing Component**
3. Enter the URL to your `template.yaml`:
   ```
   https://github.com/your-org/devspaces-devfile-creator-template/blob/main/template.yaml
   ```
4. Click **Analyze** and **Import**

#### Option B: Add to Catalog Locations

Add to your `app-config.yaml`:

```yaml
catalog:
  locations:
    - type: url
      target: https://github.com/your-org/devspaces-devfile-creator-template/blob/main/template.yaml
      rules:
        - allow: [Template]
```

### Step 2: Install Custom Scaffolder Actions

#### Build the Custom Actions

```bash
cd custom-actions
npm install
npm run build
```

#### Integrate with Backstage

1. Copy the custom actions to your Backstage backend:

```bash
cp -r custom-actions packages/backend/src/plugins/scaffolder/actions/devspaces
```

2. Update your Backstage backend to load the custom action:

**File**: `packages/backend/src/plugins/scaffolder.ts`

```typescript
import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { createDevSpacesWorkspaceAction } from './actions/devspaces';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  const actions = [
    // ... other actions
    createDevSpacesWorkspaceAction(),
  ];

  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    actions,
  });
}
```

3. Rebuild your Backstage backend:

```bash
yarn workspace backend build
```

### Step 3: Configure DevSpaces Integration

Add DevSpaces configuration to `app-config.yaml`:

```yaml
devspaces:
  baseUrl: https://devspaces.apps.your-cluster.example.com
  # Optional: API token for automated workspace creation
  # token: ${DEVSPACES_API_TOKEN}

integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}
```

### Step 4: Set Environment Variables

Set required environment variables:

```bash
export GITHUB_TOKEN=ghp_your_github_token
# Optional for automated workspace creation:
export DEVSPACES_API_TOKEN=your_devspaces_token
```

## Usage

### Creating a Workspace

1. Navigate to **Create** in Backstage
2. Select **OpenShift DevSpaces Workspace Creator**
3. Fill in the form:
   - **Project Information**: Name, description, owner
   - **Technology Stack**: Choose your language/framework
   - **Container Configuration**: Memory, CPU, ports
   - **Database & Services**: Select databases and additional services
   - **DevSpaces Configuration**: Set options for persistence and auto-start

4. Click **Review** and **Create**

### What Gets Created

The template will:

1. ✅ Generate a customized `devfile.yaml`
2. ✅ Create a `catalog-info.yaml` for Backstage catalog
3. ✅ Generate a project `README.md`
4. ✅ Publish to a GitHub repository
5. ✅ Register the component in Backstage catalog
6. ✅ (Optional) Create the DevSpaces workspace automatically

## Customization

### Adding New Technology Stacks

Edit `template.yaml` to add new stack options:

```yaml
techStack:
  enum:
    - nodejs
    - your-new-stack  # Add here
  enumNames:
    - 'Node.js'
    - 'Your New Stack'  # Add display name
```

Then update `skeleton/devfile.yaml` with the corresponding configuration:

```yaml
{% elif values.techStack == 'your-new-stack' -%}
- name: YOUR_ENV_VAR
  value: your_value
{% endif -%}
```

### Adding New Database Options

In `template.yaml`:

```yaml
databaseType:
  enum:
    - postgresql
    - your-new-db  # Add here
```

In `skeleton/devfile.yaml`:

```yaml
{% if values.databaseType == 'your-new-db' %}
- name: your-db
  container:
    image: your-db-image:latest
    # ... configuration
{% endif %}
```

### Modifying Resource Defaults

Edit the default values in `template.yaml`:

```yaml
memoryLimit:
  default: 2Gi  # Change default memory

cpuLimit:
  default: 1000m  # Change default CPU
```

## Advanced Configuration

### Custom Base Images

Add custom images to the `containerImage` enum:

```yaml
containerImage:
  enum:
    - registry.redhat.io/devspaces/udi-rhel8:latest
    - your-registry.io/your-custom-image:tag
```

### Pre-configured Templates

Create preset configurations by adding new templates with pre-filled values:

```yaml
# template-nodejs-postgres.yaml
parameters:
  - title: Project Info
    properties:
      name:
        # ... same as before
  # Override defaults
  - title: Stack (Pre-configured)
    properties:
      techStack:
        default: nodejs
        const: nodejs  # Force this value
      databaseType:
        default: postgresql
        const: postgresql
```

### Adding Workspace Lifecycle Hooks

Add custom commands to run at different lifecycle stages:

In `skeleton/devfile.yaml`:

```yaml
events:
  postStart:
    - install
    - custom-setup
  preStop:
    - cleanup-resources

commands:
  - id: custom-setup
    exec:
      component: dev-container
      commandLine: ./scripts/setup.sh
```

## Troubleshooting

### Template Not Appearing

- Verify the template is registered in the catalog
- Check `app-config.yaml` for correct catalog location
- Look for errors in Backstage logs: `yarn dev` or `kubectl logs`

### Custom Action Failing

- Ensure custom action is built: `cd custom-actions && npm run build`
- Check it's imported in `scaffolder.ts`
- Verify environment variables are set
- Check Backstage backend logs

### DevSpaces Workspace Not Creating

- Verify DevSpaces URL is correct and accessible
- Check if API token is valid (if using automated creation)
- Ensure the generated devfile is valid
- Try creating manually: `{devspacesUrl}#{repoUrl}`

### Template Validation Errors

- Check YAML syntax in `template.yaml`
- Validate Nunjucks templates in `skeleton/devfile.yaml`
- Test template locally before committing

## Testing

### Local Template Testing

1. Use the Backstage CLI to test the template:

```bash
yarn backstage-cli create --template template.yaml
```

2. Or create a test repository and run through the flow in your local Backstage

### Validating Generated Devfiles

```bash
# Install devfile CLI
npm install -g @devfile/cli

# Validate the generated devfile
devfile validate devfile.yaml
```

## Security Considerations

1. **Secrets Management**: Never hardcode credentials in devfiles
   - Use environment variables
   - Leverage OpenShift secrets
   - Use Backstage's secret management

2. **Access Control**: Restrict who can create workspaces
   ```yaml
   # In template.yaml
   spec:
     owner: platform-team
     # Add permissions
   ```

3. **Resource Limits**: Set appropriate limits to prevent resource exhaustion
   - Memory limits
   - CPU limits
   - Storage quotas

4. **Image Security**: Use trusted base images
   - Red Hat verified images
   - Scan images for vulnerabilities
   - Keep images updated

## Support and Contribution

### Getting Help

- Check Backstage documentation: https://backstage.io/docs
- DevSpaces documentation: https://access.redhat.com/documentation/en-us/red_hat_openshift_dev_spaces
- File issues in your template repository

### Contributing

To contribute improvements:

1. Fork the template repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Additional Resources

- [Backstage Software Templates](https://backstage.io/docs/features/software-templates)
- [Devfile Specification](https://devfile.io/docs/2.2.0)
- [OpenShift DevSpaces Documentation](https://developers.redhat.com/products/openshift-dev-spaces)
- [Scaffolder Actions](https://backstage.io/docs/features/software-templates/builtin-actions)

## License

Apache-2.0

---

**Questions?** Open an issue or contact the platform team.
