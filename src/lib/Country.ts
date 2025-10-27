export default class Country {
    public color: string = `hsl(${Math.random() * 360}, 60%, 60%)`;
    public population: number;
    public BIPpC: number;
    public BIP: number;
    public constructor(public ID: number,
        public name: string,
        public cells: Cells) {
        const popPerCell = Math.floor(Math.random() * (75000 - 1000 + 1) + 1000);
        this.population = popPerCell * cells.length;
        this.BIPpC = Math.floor(Math.random() * (25000 - 250 + 1) + 250);
        this.BIP = this.population * this.BIPpC;
    }
}