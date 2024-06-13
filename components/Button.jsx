import { primary,danger } from '@/lib/colors';
import { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

const bounceAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  15% {
    transform: translateY(-8px);
  }
  30% {
    transform: translateY(0);
  }
  45% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-3px);
  }
  87% {
    transform: translateY(0);
  }
  93% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
`;

export const ButtonStyle = css`
  border: 0;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 500;
  font-family: var(--font-poppins);

  svg {
    height: 1rem;
    margin-right: 5px;
  }

  ${(props) =>
    props.block &&
    css`
      display: block;
      width: 100%;
    `}

  ${(props) =>
    props.white &&
    !props.outline &&
    css`
      background-color: #fff;
      color: #000;
    `}

  ${(props) =>
    props.white &&
    props.outline &&
    css`
      background-color: transparent;
      color: #fff;
      border: solid 1px #fff;
    `}

    ${(props) =>
    props.black &&
    !props.outline &&
    css`
      background-color: #000;
      color: #fff;
    `}

  ${(props) =>
    props.black &&
    props.outline &&
    css`
      background-color: transparent;
      color: #000;
      border: solid 1px #000;
    `}

  ${(props) =>
    props.primary &&
    !props.outline &&
    css`
      background-color: ${primary};
      border: solid 1px ${primary};
      color: #fff;
    `}

      ${(props) =>
    props.primary &&
    props.outline &&
    css`
      background-color: transparent;
      border: solid 1px ${primary};
      color: ${primary};
    `}

    ${(props) =>
    props.danger &&
    !props.outline &&
    css`
      background-color: ${danger};
      border: solid 1px ${danger};
      color: #fff;
    `}

      ${(props) =>
    props.danger &&
    props.outline &&
    css`
      background-color: transparent;
      border: solid 1px ${danger};
      color: ${danger};
    `}

  ${(props) =>
    props.size === 'l' &&
    css`
      font-size: 1.2rem;
      padding: 10px 20px;
      border-radius: 10px;
    `}

    ${(props) =>
    props.disabled &&
    css`
      background-color: #f1f1f1;
      color: #888;
      cursor: default;
    `}

  ${(props) =>
    props.animated &&
    css`
      animation-name: ${bounceAnimation};
      animation-duration: 1s;
      animation-timing-function: linear;
      animation-iteration-count: 1;
      animation-fill-mode: forwards;
    `}
`;

const StyledButton = styled.button`
  ${ButtonStyle}
`;

export default function Button({
  children,
  onClick,
  animated,
  disabled,
  ...rest
}) {
  const [isAnimated, setIsAnimated] = useState(false);

  const handleClick = () => {
    setIsAnimated(true);
    if (onClick && !disabled) {
      onClick();
    }
  };

  const handleAnimationEnd = () => {
    setIsAnimated(false);
  };

  return (
    <StyledButton
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      animated={animated && isAnimated}
      disabled={disabled}
      {...rest}>
      {children}
    </StyledButton>
  );
}


