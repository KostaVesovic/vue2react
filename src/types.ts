import type { ComponentType, ReactNode } from "react";

export interface Lesson {
  slug: string;
  title: string;
  subtitle: string;
  Readme: ComponentType;
  Demo: ComponentType;
  demoSource: string;
  vueSource?: string;
  Instructions: ComponentType;
  exerciseStarter: string;
  exerciseSolution?: string;
  exerciseDependencies?: Record<string, string>;
  exerciseAppWrapper?: string;
}

export type { ReactNode };
