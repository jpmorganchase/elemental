import { NodeType } from '@stoplight/types';

export const bundledBranchNode = `
query BundledBranchNodeBySlug($workspaceSlug: String!, $projectSlug: String!, $branchSlug: String, $uri: String!) {
  bundledBranchNode(projectSlug: $projectSlug, uri: $uri, workspaceSlug: $workspaceSlug, branchSlug: $branchSlug) {
    id
    data
    type
    name
    uri
  }
}
`;

export type BundledBranchNode = {
  __typename?: 'BundledBranchNode';
  id: number;
  data: string;
  type: NodeType;
  name: string;
  uri: string;
};