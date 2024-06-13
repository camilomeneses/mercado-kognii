import styled from 'styled-components';

const InputGroup = styled.div`
  position: relative;
`;

const StyledInput = styled.div`
  width: 100%;
  padding: 15px 15px 5px;
  margin-top: 10px;
  margin-bottom: 5px;
  border: 1px solid #aaa;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 1rem;
  color: #777;
  cursor: default;
  overflow: auto;

  ${(props) =>
    props.value === ''
      ? `
      border-color: #e75252;
    `
      : ``}
`;

const StyledLabel = styled.label`
  position: absolute;
  top: -10px;
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

export default function InputDisabled(props) {
  return (
    <InputGroup>
      <StyledLabel>{props.label}</StyledLabel>
      <StyledInput {...props} />
    </InputGroup>
  );




}