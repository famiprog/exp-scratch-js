import { Form, FormButton, FormGroup, FormInput, MenuItem } from "semantic-ui-react";
import App from "../../App";
import { ActionsMenu, ActionsMenuReactComponent, ActionsMenuReactComponentProps, ActionsMenuRenderProps } from "./ActionsMenu";
import FryerTray from "./FryerTray";

export class FryerTrayActionsMenu extends ActionsMenu {
    render(props: ActionsMenuRenderProps<FryerTray>) {
        return <FryierTrayActionsMenuReactComponent {...props} />
    }
}

export class FryierTrayActionsMenuReactComponent extends ActionsMenuReactComponent<FryerTray, ActionsMenuReactComponentProps<FryerTray>> {
    state = {
        fillPercentage: "0"
    }

    constructor(props: ActionsMenuReactComponentProps<FryerTray>) {
        super(props);
        this.state.fillPercentage = props.entity.fillPercentage.toString();
    }

    renderMenuItems() {
        return <>
            {super.renderMenuItems()}
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
        </>
    }
}