import { Component, ReactNode } from "react";
import { Menu, MenuItem, Table, TableBody, TableCell, TableRow } from "semantic-ui-react";
import App from "../../App";

interface ActionableEntityPopupProps<E> {
    entity: E;
    propsToShow?: string[];
}

export class ActionableEntityPopup<E, P = object, S = object> extends Component<ActionableEntityPopupProps<E> & P, S> {

    protected getTitle() {
        // @ts-expect-error using .constructor
        return this.props.entity.constructor.name
    }

    protected renderMenuItems(): ReactNode {
        return undefined;
    }

    protected renderPropsTable() {
        const { entity, propsToShow } = this.props;
        return propsToShow && <MenuItem active>
            <Table compact striped>
                <TableBody>
                    <TableRow>
                        <TableCell active width={5}><h4>Property</h4></TableCell>
                        <TableCell active width={5}><h4>Value</h4></TableCell>
                    </TableRow>
                    {propsToShow.map(p => <TableRow>
                        <TableCell active>{p}</TableCell>
                        {/* @ts-expect-error using reflexion */}
                        <TableCell>{entity[p]}</TableCell>
                    </TableRow>)}

                </TableBody>
            </Table>
        </MenuItem>
    }

    render() {
        return (<>
            <Menu vertical fluid onClick={() => App.INSTANCE.showPopup(undefined)}>
                <MenuItem active><h2>{this.getTitle()}</h2></MenuItem>
                {this.renderPropsTable()}
                {this.renderMenuItems()}
            </Menu>
        </>
        )
    }
}