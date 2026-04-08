import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fetch from 'node-fetch';

/**
 * Custom Backstage scaffolder action to create OpenShift DevSpaces workspace
 */
export const createDevSpacesWorkspaceAction = () => {
  return createTemplateAction<{
    devspacesUrl: string;
    repoUrl: string;
    workspaceName?: string;
    devfileUrl?: string;
    token?: string;
  }>({
    id: 'devspaces:create',
    description: 'Creates a new workspace in OpenShift DevSpaces',
    schema: {
      input: {
        type: 'object',
        required: ['devspacesUrl', 'repoUrl'],
        properties: {
          devspacesUrl: {
            type: 'string',
            title: 'DevSpaces URL',
            description: 'The URL of your OpenShift DevSpaces instance',
          },
          repoUrl: {
            type: 'string',
            title: 'Repository URL',
            description: 'Git repository URL containing the devfile',
          },
          workspaceName: {
            type: 'string',
            title: 'Workspace Name',
            description: 'Optional custom name for the workspace',
          },
          devfileUrl: {
            type: 'string',
            title: 'Devfile URL',
            description: 'Optional direct URL to devfile (defaults to repo/devfile.yaml)',
          },
          token: {
            type: 'string',
            title: 'Auth Token',
            description: 'Optional authentication token for DevSpaces API',
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          workspaceId: {
            type: 'string',
            title: 'Workspace ID',
            description: 'The ID of the created workspace',
          },
          workspaceUrl: {
            type: 'string',
            title: 'Workspace URL',
            description: 'The URL to access the workspace',
          },
          workspaceName: {
            type: 'string',
            title: 'Workspace Name',
            description: 'The name of the created workspace',
          },
        },
      },
    },
    async handler(ctx) {
      const { devspacesUrl, repoUrl, workspaceName, devfileUrl, token } = ctx.input;

      ctx.logger.info(`Creating DevSpaces workspace from ${repoUrl}`);

      try {
        // Construct the devfile URL if not provided
        const finalDevfileUrl = devfileUrl || `${repoUrl}/raw/main/devfile.yaml`;

        // Build the workspace creation URL
        // DevSpaces format: https://devspaces-url#https://repo-url
        const workspaceCreationUrl = `${devspacesUrl}#${repoUrl}`;

        ctx.logger.info(`Workspace URL: ${workspaceCreationUrl}`);

        // If token is provided, try to use the DevSpaces API
        if (token) {
          const apiUrl = `${devspacesUrl}/api/workspace/devfile`;

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              devfileUrl: finalDevfileUrl,
              namespace: workspaceName ? `${workspaceName}-ns` : undefined,
              attributes: {
                stackName: workspaceName || 'backstage-generated',
              },
            }),
          });

          if (!response.ok) {
            throw new Error(`DevSpaces API error: ${response.statusText}`);
          }

          const workspace = await response.json();

          ctx.logger.info(`Workspace created: ${workspace.id}`);

          ctx.output('workspaceId', workspace.id);
          ctx.output('workspaceName', workspace.devfile?.metadata?.name || workspaceName);
          ctx.output('workspaceUrl', `${devspacesUrl}/dashboard/#/ide/${workspace.id}`);
        } else {
          // Without token, just return the creation URL
          // User will need to manually create the workspace
          ctx.logger.info('No token provided - returning creation URL');

          ctx.output('workspaceUrl', workspaceCreationUrl);
          ctx.output('workspaceName', workspaceName || 'pending');
        }

        ctx.logger.info('DevSpaces workspace creation completed');
      } catch (error) {
        ctx.logger.error(`Failed to create DevSpaces workspace: ${error}`);
        throw error;
      }
    },
  });
};
