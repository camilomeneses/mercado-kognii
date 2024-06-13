import styled, { keyframes } from 'styled-components';

const marqueeAnimation = keyframes`
  0% {
    transform: translateX(400%);
  }
  100% {
    transform: translateX(-300%);
  }
`;

const StyledMarqueeWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  background-color: #390099;
  color: #fff;
  font-weight: 500;
  font-size: 1.5rem;
  padding: 0 0 10px;
  border-top: 1px solid #222;
`;

const StyledMarqueeContent = styled.div`
  display: inline-block;
  white-space: nowrap;
  animation: ${marqueeAnimation} 25s linear infinite;
`;

export default function Marquee({ children, numberPhrases }) {
  return (
    <StyledMarqueeWrapper numberPhrases={numberPhrases}>
      <StyledMarqueeContent>{children}</StyledMarqueeContent>
    </StyledMarqueeWrapper>
  );
}

