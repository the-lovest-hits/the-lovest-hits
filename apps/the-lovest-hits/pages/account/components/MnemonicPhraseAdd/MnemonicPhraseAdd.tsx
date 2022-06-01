import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";

function MnemonicPhraseAdd(props) {
  return (
    <div className={props.className}>
      <div className="cube__content">
        <Input className="input" placeholder={'Add via Mnemonic phrase'}/>
        <Input className="input" placeholder={'Generate Password'}/>

        <Button className="btn btn--success">Generate</Button>
        <Button className="btn btn--success">Next</Button>
      </div>
    </div>
  )
}

export default MnemonicPhraseAdd;
