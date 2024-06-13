import styled from 'styled-components';

const StyledDivContent = styled.div`
  margin: 0 auto;
  padding: 0 25px;
`;

export default function CenterContent({ children }) {
  return <StyledDivContent>{children}</StyledDivContent>;
}

