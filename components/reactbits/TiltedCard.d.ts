import React from 'react';

export interface TiltedCardProps {
  imageSrc?: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string | number;
  containerWidth?: string | number;
  imageHeight?: string | number;
  imageWidth?: string | number;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  overlayDepth?: number;
  children?: React.ReactNode;
  backContent?: React.ReactNode;
  flipOnClick?: boolean;
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  radius?: number;
  perspective?: number;
  smoothness?: number;
  glare?: number;
  glareColor?: string;
  shadow?: number;
  parallax?: number;
  axis?: 'x' | 'y' | 'both';
  reverse?: boolean;
  trackWindow?: boolean;
  floating?: boolean;
  gyroscope?: boolean;
  intro?: boolean;
  introDelay?: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface TiltedCardLayerProps {
  depth?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const TiltedCardLayer: React.FC<TiltedCardLayerProps>;
declare const TiltedCard: React.FC<TiltedCardProps>;
export default TiltedCard;
