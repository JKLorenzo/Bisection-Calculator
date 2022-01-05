import solveBisection from "./modules/bisection.js";
import express, { json } from "express";
import solveFx from "./modules/fx.js";
import { solve, round } from "./modules/math.js";
import { Options } from "./utils/types.js";

const port = process.env.PORT ?? 3000;
const client = express().use(json());

client.get("/status", (_, res) => {
  res.json({ status: "online" });
});

client.post("/bisection", (req, res) => {
  const input = req.body;

  try {
    const options = {} as Options;

    if (typeof input.equation !== "string" || input.equation.length === 0) {
      throw "Property 'equation' must be a string with a length greater than 1.";
    }

    if ("ea" in input) {
      if (typeof input.ea !== "string") {
        throw "Property 'ea' must be a string.";
      }

      input.ea = input.ea.trim().replaceAll(" ", "");

      if (input.ea.length > 0) {
        if (!(input.ea.startsWith("<=") || input.ea.startsWith("<")))
          throw "Property 'ea' must start with the '<=' or '<' prefix.";

        options.ea = input.ea;
      }
    }

    if ("range" in input) {
      if (typeof input.range !== "number")
        throw "Property 'range' must be a number.";

      options.range = input.range;
    }

    if ("places" in input) {
      if (typeof input.places !== "number")
        throw "Property 'places' must be a number.";

      options.places = input.places;
    }

    const result = solveBisection(input.equation, options);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

client.post("/fx", (req, res) => {
  const input = req.body;

  try {
    if (typeof input.equation !== "string") {
      throw "Property 'equation' must be a string.";
    }

    if ("x" in input && typeof input.x !== "number") {
      throw "Property 'x' must be a number.";
    }

    if ("places" in input && typeof input.places !== "number") {
      throw "Property 'places' must be a number.";
    }

    let result = solveFx(input.equation, input.x);

    if ("places" in input && input.places > 0) {
      result = round(result, input.places);
    }

    res.json({ result });
  } catch (error) {
    res.status(500).json({ error });
  }
});

client.post("/solve", (req, res) => {
  const input = req.body;

  try {
    if (typeof input.equation !== "string") {
      throw "Property 'equation' must be a string.";
    }

    if ("places" in input && typeof input.places !== "number") {
      throw "Property 'places' must be a number.";
    }

    let result = solve(input.equation);

    if ("places" in input && input.places > 0) {
      result = round(result, input.places);
    }

    res.json({ result });
  } catch (error) {
    res.status(500).json({ error });
  }
});

client.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
