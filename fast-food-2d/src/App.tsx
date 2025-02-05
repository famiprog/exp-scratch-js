import { Yielding } from 'leopard/dist/lib/yielding';
import React, { Component, ReactNode } from 'react';
import { Button, Label, Modal, Segment } from 'semantic-ui-react';
import "./App.css";
import { createProjet, STAGE_HEIGHT, STAGE_WIDTH } from './leopardProjectMain';
import Character from './leopard_ext/entities/Character';
import MovingEntity from './leopard_ext/entities/MovingEntity';
import { Utils } from './leopard_ext/utils/Utils';
import { renderIntoDocument } from 'react-dom/test-utils';

const orderTerminals: { x: number, y: number, customer?: Character }[] = [
  { x: 179, y: 160 },
  { x: 250, y: 80 },
  { x: 322, y: 160 }
];

interface AppState {
  mousePosition?: [number, number];
  modalPosition?: [number, number];
  modalRenderFunction?: () => ReactNode;
}

class App extends Component<unknown, AppState> {

  static INSTANCE: App;

  protected canvas: HTMLElement | null = null;

  protected modalRef = React.createRef<any>();

  constructor(props: unknown) {
    super(props);
    App.INSTANCE = this;
    this.state = {};
  }

  componentDidMount(): void {
    window.document.onmousemove = event => {
      this.setState({ mousePosition: [event.x, event.y] });
    }

    createProjet();
  }

  showPopup(modalRenderFunction?: () => ReactNode) {
    if (this.state.mousePosition && modalRenderFunction) {
      // offset a bit, to have the mouse cursor cursor inside the content area of the modal
      const [x, y] = this.state.mousePosition;
      this.setState({ modalPosition: [x - 40, y - 80], modalRenderFunction })
    } else {
      this.setState({ modalPosition: undefined, modalRenderFunction: undefined })
    }
    setTimeout(() => {
      const e = document.getElementById("modal");
      const rect = e?.getBoundingClientRect();
      if (!rect) {
        return;
      }
      this.setState({
        modalPosition: [
          Math.min(this.state.modalPosition![0], window.innerWidth - rect.width - 10),
          Math.min(this.state.modalPosition![1], window.innerHeight - rect.height - 10),
        ]
      })

    }, 100)
  }

  render() {
    if (!this.canvas) {
      this.canvas = window.document.querySelector("#project > canvas")
    }
    let xScratch: number | undefined = undefined;
    let yScratch: number | undefined = undefined;
    if (this.canvas && this.state.mousePosition) {
      const rect = this.canvas.getBoundingClientRect();
      xScratch = Math.round(this.state.mousePosition[0]
        // in scratch, x, y are in the middle of the screen. Hence translation using half of width/height
        - STAGE_WIDTH / 2
        // correction if the canvas is not top/left i.e. 0, 0
        - rect.x);

      // in scratch the y axis is inverted; i.e. it's like we draw graphs in math
      yScratch = Math.round(-this.state.mousePosition[1]
        + STAGE_HEIGHT / 2
        + rect.y);
    }

    return <>
      <Segment raised>
        Mouse position: {xScratch !== undefined && <Label horizontal content={"(" + xScratch + ", " + yScratch + ")"} />}
        <Button content="New customer" onClick={() => {
          new Character().addToProject(-390, 166);

          // const hat = new Hat();
          // Utils.addToProject(hat, -390, 166);

          // customer.addChildToProject(hat, 0, 44);
          // ViewportTransform.instance.setSpriteForSizeFineAdjustment(hat, customer);
        }} />
        <Button content="Program 1" onClick={() => {
          function* myFunc(): Yielding<void> {
            const customer = new Character().addToProject(-390, 166);

            customer.effects.color = 10 + Math.random() * 180;
            yield* customer.startSound("Doorbell");

            for (const ot of orderTerminals) {
              if (ot.customer) {
                continue;
              }
              yield* customer.walk(ot.x, ot.y);
              ot.customer = customer;
              customer.direction = 180;
              yield* customer.sayAndWait("Please give me a box of fries 🍟", 2);
              return;
            }

            customer.say("No place for me ☹️");
          }

          Utils.startGenerator(() => myFunc());
        }} />
      </Segment>
      {this.state.modalPosition && <Modal id="modal" open size='mini' style={{ top: `${this.state.modalPosition[1]}px`, left: `${this.state.modalPosition[0]}px` }} onClose={() => {
        this.canvas!.focus();
        this.setState({ modalPosition: undefined });
      }}>
        {this.state.modalRenderFunction!()}
      </Modal>}
      <div id="project"
        onClick={() => {
          setTimeout(() => {
            if (!Utils.mouseClickProcessedInScratch) {
              Utils.startGenerator(() => MovingEntity.movingEntities.find(c => c.selected)?.walk(xScratch!, yScratch!));
            }
            Utils.mouseClickProcessedInScratch = false;
          }, 50);
        }}
      />
    </>
  }
}

export default App