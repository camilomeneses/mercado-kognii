import { borderDanger } from '@/lib/colors';
import styled from 'styled-components';

const InputGroup = styled.div`
  position: relative;

  ${(props) =>
    props.noLabel
      ? `
    :label{
      display:none;
    }
  `
      : ``}
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 15px 15px 5px;
  margin-top: 10px;
  margin-bottom: 5px;
  border: 1px solid #aaa;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 1.1rem;
  font-family: inherit;
  overflow: auto;

  ${(props) =>
    props.value === '' && props.require
      ? `
      border-color: ${borderDanger}
     `
      : ``}
`;

const StyledLabel = styled.label`
  position: absolute;
  top: 0px;
  left: 5px;
  font-size: 1rem;
  padding: 0 5px;
  z-index: 1;

  ::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    height: 5px;
    background-color: #fff;
    z-index: -1;
  }
`;

export default function Input(props) {
  return (
    <InputGroup>
      <StyledLabel>{props.label}</StyledLabel>
      <StyledInput {...props}/>
    </InputGroup>
  );
}


