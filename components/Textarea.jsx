import { borderDanger } from '@/lib/colors';
import styled from 'styled-components';

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 15px 15px 5px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #aaa;
  border-radius: 5px;
  box-sizing: border-box;
  font-family: inherit;
  display: block;
  height: 80px;
  resize: none;

  ${(props) =>
    props.value === '' && props.require
      ? `
      border-color: ${borderDanger}
     `
      : ``}
`;

export default function Textarea(props) {
  return <StyledTextarea {...props} />;
}

