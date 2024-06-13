import Image from 'next/image';
import styled from 'styled-components';

const StyleImage = styled(Image)`
  border-radius: 20px;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export default function Images({ ...rest }) {
  return <StyleImage width={1000} height={1000} {...rest} />;
}


