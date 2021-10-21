const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const hash = require("circomlibjs").poseidon;
const {merkelize, getMerkleProof} = require("../js/mkt2.js");
const F = require("circomlibjs").babyjub.F;

describe("Check Merkle tree Circuit", function () {
    let circuit;

    this.timeout(10000000);

    before( async() => {
        circuit = await wasm_tester(path.join(__dirname, "circuits", "mkt2_tester.circom"));
    });

    it("Should check inclussion in MT", async () => {
        const m = merkelize(F, hash, [11,22,33,44,55,66,77,88], 3);
        const root = m[0];
        const mp = getMerkleProof(m, 2, 3);

        const input={
            key: F.e(2),
            value: F.e(33),
            root: root,
            siblings: mp
        };

        await circuit.calculateWitness(input, true);
    });

});