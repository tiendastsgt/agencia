/// <reference types="vite/client" />

// Recharts type overrides to fix React compatibility issues
declare module 'recharts' {
  import React from 'react';
  
  export const ResponsiveContainer: React.ComponentType<any>;
  export const LineChart: React.ComponentType<any>;
  export const AreaChart: React.ComponentType<any>;
  export const BarChart: React.ComponentType<any>;
  export const PieChart: React.ComponentType<any>;
  export const XAxis: React.ComponentType<any>;
  export const YAxis: React.ComponentType<any>;
  export const CartesianGrid: React.ComponentType<any>;
  export const Tooltip: React.ComponentType<any>;
  export const Legend: React.ComponentType<any>;
  export const Line: React.ComponentType<any>;
  export const Area: React.ComponentType<any>;
  export const Bar: React.ComponentType<any>;
  export const Pie: React.ComponentType<any>;
  export const Cell: React.ComponentType<any>;
}
