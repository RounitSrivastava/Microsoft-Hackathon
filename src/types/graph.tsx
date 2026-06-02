export interface GraphNode {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
  };
}