import styled from 'styled-components';

const StyledDiv = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;

  @media screen and (min-width: 350px) {
    padding: 0 30px;
  }
  @media screen and (min-width: 540px) {
    padding: 0 40px;
  }
  @media screen and (min-width: 1024px) {
    max-width: 900px;
  }
`;

export default function Center({ children }) {
  return <StyledDiv>{children}</StyledDiv>;
}





