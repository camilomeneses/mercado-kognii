import styled from 'styled-components';
import StarOutlineIcon from './icons/StartOutlineIcon';
import { useState } from 'react';
import StarSolidIcon from './icons/StarSolidIcon';

const StarsWrapper = styled.div`
  display: inline-flex;
  gap: 3px;
  position: relative;
  align-items: center;
`;

const StarWrapper = styled.button`
  padding: 0;
  border: 0;
  display: inline-block;
  background-color: transparent;

  ${(props) =>
    props.size === 'sm' &&
    `
    height: 1rem;
    width: 1rem;
  `}
  ${(props) =>
    props.size === 'md' &&
    `
    height: 1.4rem;
    width: 1.4rem;
  `}

    ${(props) =>
    !props.disabled &&
    `
    cursor:pointer;
  `}
`;

export default function StartsRating({
  defaultHowMany = 0,
  onChange = () => {},
  disabled = false,
  size = 'md',
}) {
  const [howMany, setHowMany] = useState(defaultHowMany);
  const five = [1, 2, 3, 4, 5];

  function handleStarClick(number) {
    if (disabled) {
      return;
    }
    setHowMany(number);
    onChange(number);
  }

  return (
    <StarsWrapper>
      {five.map((number) => (
        <StarWrapper
          disabled={disabled}
          size={size}
          key={number.toString()}
          type="button"
          onClick={() => handleStarClick(number)}>
          {howMany >= number ? <StarSolidIcon /> : <StarOutlineIcon />}
        </StarWrapper>
      ))}
    </StarsWrapper>
  );
}

