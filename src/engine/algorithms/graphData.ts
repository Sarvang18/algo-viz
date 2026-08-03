import type { DSSnapshot, GraphEdge, GraphNode } from '../Step';

export const graphNodes: GraphNode[] = [
  { id: '0', label: 'A', x: 110, y: 290 },
  { id: '1', label: 'B', x: 300, y: 110 },
  { id: '2', label: 'C', x: 300, y: 470 },
  { id: '3', label: 'D', x: 510, y: 140 },
  { id: '4', label: 'E', x: 510, y: 440 },
  { id: '5', label: 'F', x: 700, y: 290 },
];

export const traversalEdges: GraphEdge[] = [
  { id: '0-1', from: '0', to: '1' },
  { id: '0-2', from: '0', to: '2' },
  { id: '1-3', from: '1', to: '3' },
  { id: '2-4', from: '2', to: '4' },
  { id: '3-4', from: '3', to: '4' },
  { id: '3-5', from: '3', to: '5' },
  { id: '4-5', from: '4', to: '5' },
];

export const weightedDirectedEdges: GraphEdge[] = [
  { id: '0-1', from: '0', to: '1', weight: 4 },
  { id: '0-2', from: '0', to: '2', weight: 2 },
  { id: '2-1', from: '2', to: '1', weight: 1 },
  { id: '1-3', from: '1', to: '3', weight: 5 },
  { id: '2-3', from: '2', to: '3', weight: 8 },
  { id: '2-4', from: '2', to: '4', weight: 10 },
  { id: '3-4', from: '3', to: '4', weight: 2 },
  { id: '3-5', from: '3', to: '5', weight: 6 },
  { id: '4-5', from: '4', to: '5', weight: 3 },
];

export const weightedUndirectedEdges: GraphEdge[] = [
  { id: '0-1', from: '0', to: '1', weight: 4 },
  { id: '0-2', from: '0', to: '2', weight: 2 },
  { id: '1-2', from: '1', to: '2', weight: 1 },
  { id: '1-3', from: '1', to: '3', weight: 5 },
  { id: '2-3', from: '2', to: '3', weight: 8 },
  { id: '2-4', from: '2', to: '4', weight: 10 },
  { id: '3-4', from: '3', to: '4', weight: 2 },
  { id: '3-5', from: '3', to: '5', weight: 6 },
  { id: '4-5', from: '4', to: '5', weight: 3 },
];

export const dagEdges: GraphEdge[] = [
  { id: '0-1', from: '0', to: '1' },
  { id: '0-2', from: '0', to: '2' },
  { id: '1-3', from: '1', to: '3' },
  { id: '2-3', from: '2', to: '3' },
  { id: '2-4', from: '2', to: '4' },
  { id: '3-5', from: '3', to: '5' },
  { id: '4-5', from: '4', to: '5' },
];

export const sccEdges: GraphEdge[] = [
  { id: '0-1', from: '0', to: '1' },
  { id: '1-2', from: '1', to: '2' },
  { id: '2-0', from: '2', to: '0' },
  { id: '1-3', from: '1', to: '3' },
  { id: '3-4', from: '3', to: '4' },
  { id: '4-3', from: '4', to: '3' },
  { id: '4-5', from: '4', to: '5' },
];

export const bridgeEdges: GraphEdge[] = [
  { id: '0-1', from: '0', to: '1' },
  { id: '1-2', from: '1', to: '2' },
  { id: '0-2', from: '0', to: '2' },
  { id: '1-3', from: '1', to: '3' },
  { id: '3-4', from: '3', to: '4' },
  { id: '4-5', from: '4', to: '5' },
  { id: '3-5', from: '3', to: '5' },
];

export const graphSnapshot = (edges: GraphEdge[], directed: boolean): DSSnapshot => ({
  type: 'graph',
  nodes: graphNodes.map((node) => ({ ...node })),
  edges: edges.map((edge) => ({ ...edge })),
  directed,
});

export const outgoingEdges = (edges: GraphEdge[], nodeId: string): GraphEdge[] =>
  edges.filter((edge) => edge.from === nodeId);

export const incidentEdges = (edges: GraphEdge[], nodeId: string): GraphEdge[] =>
  edges.filter((edge) => edge.from === nodeId || edge.to === nodeId);

export const oppositeNode = (edge: GraphEdge, nodeId: string): string =>
  edge.from === nodeId ? edge.to : edge.from;
