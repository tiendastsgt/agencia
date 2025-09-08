// Recharts type fixes for React compatibility
declare module 'recharts' {
  import { Component, ReactNode } from 'react';

  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    children?: ReactNode;
    [key: string]: any;
  }

  export interface LineChartProps {
    width?: number;
    height?: number;
    data?: any[];
    margin?: any;
    children?: ReactNode;
    [key: string]: any;
  }

  export interface AreaChartProps {
    width?: number;
    height?: number;
    data?: any[];
    margin?: any;
    children?: ReactNode;
    [key: string]: any;
  }

  export interface BarChartProps {
    width?: number;
    height?: number;
    data?: any[];
    margin?: any;
    children?: ReactNode;
    [key: string]: any;
  }

  export interface PieChartProps {
    width?: number;
    height?: number;
    children?: ReactNode;
    [key: string]: any;
  }

  export interface XAxisProps {
    dataKey?: string;
    tickFormatter?: (value: any) => string;
    [key: string]: any;
  }

  export interface YAxisProps {
    tickFormatter?: (value: any) => string;
    [key: string]: any;
  }

  export interface CartesianGridProps {
    strokeDasharray?: string;
    [key: string]: any;
  }

  export interface TooltipProps {
    formatter?: (value: any, name?: string) => [ReactNode, string];
    labelFormatter?: (label: any) => ReactNode;
    [key: string]: any;
  }

  export interface LegendProps {
    [key: string]: any;
  }

  export interface LineProps {
    type?: 'monotone' | 'basis' | 'basisClosed' | 'basisOpen' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'step' | 'stepBefore' | 'stepAfter';
    dataKey?: string;
    stroke?: string;
    strokeWidth?: number;
    dot?: boolean | any;
    [key: string]: any;
  }

  export interface AreaProps {
    type?: 'monotone' | 'basis' | 'basisClosed' | 'basisOpen' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'step' | 'stepBefore' | 'stepAfter';
    dataKey?: string;
    stackId?: string;
    stroke?: string;
    fill?: string;
    [key: string]: any;
  }

  export interface BarProps {
    dataKey?: string;
    fill?: string;
    [key: string]: any;
  }

  export interface PieProps {
    data?: any[];
    dataKey?: string;
    nameKey?: string;
    cx?: string | number;
    cy?: string | number;
    outerRadius?: number;
    fill?: string;
    [key: string]: any;
  }

  export interface CellProps {
    fill?: string;
    [key: string]: any;
  }

  export class ResponsiveContainer extends Component<ResponsiveContainerProps> {}
  export class LineChart extends Component<LineChartProps> {}
  export class AreaChart extends Component<AreaChartProps> {}
  export class BarChart extends Component<BarChartProps> {}
  export class PieChart extends Component<PieChartProps> {}
  export class XAxis extends Component<XAxisProps> {}
  export class YAxis extends Component<YAxisProps> {}
  export class CartesianGrid extends Component<CartesianGridProps> {}
  export class Tooltip extends Component<TooltipProps> {}
  export class Legend extends Component<LegendProps> {}
  export class Line extends Component<LineProps> {}
  export class Area extends Component<AreaProps> {}
  export class Bar extends Component<BarProps> {}
  export class Pie extends Component<PieProps> {}
  export class Cell extends Component<CellProps> {}
}