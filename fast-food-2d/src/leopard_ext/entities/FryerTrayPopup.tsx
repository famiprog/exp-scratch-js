import { Form, FormButton, FormGroup, FormInput, MenuItem } from "semantic-ui-react";
import App from "../../App";
import { ActionableEntityPopup } from "./ActionableEntityPopup";
import FriesBox from "./FriesBox";
import FryerTray from "./FryerTray";
import { Utils } from "../utils/Utils";

interface FryerTrayPopupProps { entity: FryerTray };

export class FryerTrayPopup extends ActionableEntityPopup<FryerTray, FryerTrayPopupProps> {
    state = {
        fillPercentage: "0"
    }

    constructor(props: FryerTrayPopupProps) {
        super(props);
        this.state.fillPercentage = props.entity.fillPercentage.toString();
    }

    renderMenuItems() {
        return <>
            <MenuItem icon="circle outline" content="Set empty" onClick={() => this.props.entity.setFillPercentage(0)} />
            <MenuItem icon="circle" content="Set full" onClick={() => this.props.entity.setFillPercentage(100)} />

            <MenuItem onClick={e => e.stopPropagation()}>
                <Form>
                    <FormGroup>
                        <FormInput placeholder='Set fill percentage' width={16} value={this.state.fillPercentage} onChange={(e, data) => this.setState({ fillPercentage: data.value })} />
                        <FormButton content="Set" onClick={() => {
                            this.props.entity.setFillPercentage(parseInt(this.state.fillPercentage));
                            App.INSTANCE.showPopup(undefined);
                        }} />
                    </FormGroup>
                </Form>
            </MenuItem>

            <MenuItem icon="food" content="Give FriesBox" onClick={() => {
                const fb = new FriesBox().addToProject(0, 0);
                fb.setFillPercentage(100);
                Utils.startGenerator(() => fb.sayAndWait("FriesBox created", 2));
            }} />
        </>
    }
}