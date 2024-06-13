import { PulseLoader } from 'react-spinners';
import styled from 'styled-components';

const Wrapper = styled.div`
  ${(props) =>
    props.fullWidth
      ? `
    padding: 100px 0;
    display: flex;
    justify-content: center;
  `
      : ``}
`;

export default function Spinner({ fullWidth }) {
  return (
    <Wrapper fullWidth={fullWidth}>
      <PulseLoader color={'#555'} speedMultiplier={1} />
    </Wrapper>
  );
}

