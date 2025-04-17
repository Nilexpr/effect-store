import React from 'react';
import { Recursively } from './tool';
export interface Header
  extends Recursively<{
    label: string;
    isPlaceholder?: boolean;
    key: React.Key;
    align?: string;
  }> {}
