import { SpriteExt } from "../libEnhancements/SpriteExt";
import { Component, ReactNode } from "react";
import { Label, Menu, MenuItem, Table, TableBody, TableCell, TableRow } from "semantic-ui-react";
import App from "../../App";
import { Utils } from "../utils/Utils";
import Character from "./Character";

export type ActionsMenuRenderProps<E = unknown> = Partial<ActionsMenuReactComponentProps<E>> & { entity: E, character: Character };

export class ActionsMenu {

    constructor(public entity: SpriteExt, public propsToShow: string[], public functionsToShow: string[]) {
    }

    show(character: Character) {
        App.INSTANCE.showPopup(() => this.render({ entity: this.entity, character, propsToShow: this.propsToShow, functionsToShow: this.functionsToShow }));
    }

    render(props: ActionsMenuRenderProps) {
        return <ActionsMenuReactComponent {...props} />
    }
}

export interface ActionsMenuReactComponentProps<E> {
    entity: E;
    character: Character;
    propsToShow?: string[];
    functionsToShow?: string[];
}

export class ActionsMenuReactComponent<E, P extends ActionsMenuReactComponentProps<E>, S = object> extends Component<P, S> {

    protected getTitle() {
        // @ts-expect-error using .constructor
        return this.props.entity.constructor.name
    }

    protected renderMenuItems(): ReactNode {
        const { entity, functionsToShow, character } = this.props;

        return <>
            {functionsToShow?.map(f => <MenuItem key={f} onClick={() => {
                // @ts-expect-error reflection
                Utils.startGenerator(() => entity[f](character));
            }}>
                <Label circular content="F" />{f}()
            </MenuItem>)}
        </>
    }

    protected renderPropsTable() {
        const { entity, propsToShow } = this.props;
        return propsToShow && propsToShow.length > 0 && <MenuItem active>
            <Table compact striped>
                <TableBody>
                    <TableRow>
                        <TableCell active width={5}><h4>Property</h4></TableCell>
                        <TableCell active width={5}><h4>Value</h4></TableCell>
                    </TableRow>
                    {propsToShow.map(p => <TableRow key={p}>
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