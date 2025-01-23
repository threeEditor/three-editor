

export class LayoutSize {
    static PanelPadding = 8;
    static PropertyPanelWidth = 300
    static HierarchyPanelWidth = 200
    static get CenterPanelWidth() {
        const width = window.innerWidth - LayoutSize.HierarchyPanelWidth - LayoutSize.PropertyPanelWidth;
        return width;
    };
};