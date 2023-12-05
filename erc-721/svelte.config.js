import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import fs from "fs"
import template from "lodash.template"
import { parse } from "svelte-parse"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess(), extractInfoPreprocessor()],
}

export default config

function extractInfoPreprocessor() {
  return {
    markup: ({ content, filename }) => {
      if (!filename.endsWith("App.svelte")) {
        return
      }
      const ast = parse({ value: content, generatePositions: false })
      const extractedData = {
        meta: {},
        contracts: [],
        cards: [],
      }

      traverseAST(ast, (node) => {
        switch (node.tagName) {
          case "Meta":
            extractedData.meta = extractAttributes(node)
            break
          case "Contract":
            extractedData.contracts.push(extractAttributes(node))
            break
          case "Card":
            extractedData.cards.push(extractAttributes(node))
            break
        }
      })

      buildTokenScriptXML("./src/_core/ts-template.xml", extractedData)

      console.log(extractedData, "===============+!!!!!!!!!!!!!!!!!")
    },
  }
}

function traverseAST(ast, callback) {
  if (!ast || typeof ast !== "object") return

  if (ast.type === "svelteComponent") {
    callback(ast)
  }

  if (ast.children) {
    ast.children.forEach((child) => traverseAST(child, callback))
  }
}

function extractAttributes(node) {
  const attributes = {}
  console.log(JSON.stringify(node.properties), "node.properties")
  node.properties.forEach((prop) => {
    if (prop.type === "svelteProperty") {
      attributes[prop.name] = prop.value.map((v) => v.value).join("")
    }
  })
  return attributes
}

function buildTokenScriptXML(filepath, data) {
  try {
    const fileContent = fs.readFileSync(filepath, "utf-8")

    const compiled = template(fileContent)

    const result = compiled({
      meta_name: data.meta.name,
      meta_description: data.meta.description,
      meta_aboutUrl: data.meta.aboutUrl,
      meta_iconUrl: data.meta.iconUrl,
      contracts: data.contracts.map(buildContractXML).join("\n"),
      cards: data.cards.map(buildCardXml).join("\n"),
      attributes: buildAttributesXml(),
    })

    fs.writeFile("./tokenscript.xml", result, { flag: "w+" }, function (err) {
      if (err) throw err
      console.log("TokenScript File written successfully")
    })
  } catch (error) {
    console.error(`Error while reading file and interpolating: ${error}`)
  }
}

function buildContractXML(contract) {
  return `
    <ts:contract interface="${contract.interface}" name="${contract.id}">
      <ts:address network="${contract.chain}">${contract.address}</ts:address>
    </ts:contract>
    <ts:origins>
      <ts:ethereum contract="${contract.id}"/>
    </ts:origins>
`
}

function buildAttributesXml() {
  // TODO: make this dynamic
  return `
    <ts:attribute name="sendingAccountAddress">
      <ts:type>
        <ts:syntax>1.3.6.1.4.1.1466.115.121.1.15</ts:syntax>
      </ts:type>
      <ts:label>
        <ts:string xml:lang="en">sending account address</ts:string>
      </ts:label>
      <ts:origins>
        <ts:user-entry as="address"/>
      </ts:origins>
    </ts:attribute>

    <ts:attribute name="receivingAccountAddress">
      <ts:type>
        <ts:syntax>1.3.6.1.4.1.1466.115.121.1.15</ts:syntax>
      </ts:type>
      <ts:label>
        <ts:string xml:lang="en">receiving account address</ts:string>
      </ts:label>
      <ts:origins>
        <ts:user-entry as="address"/>
      </ts:origins>
    </ts:attribute>

    <ts:attribute name="tokenId">
      <ts:type>
        <ts:syntax>1.3.6.1.4.1.1466.115.121.1.36</ts:syntax>
      </ts:type>
      <ts:origins>
        <ethereum:call function="tokenId" contract="Token" as="uint">
          <ts:data>
            <ts:uint256 ref="tokenId"/>
          </ts:data>
        </ethereum:call>
      </ts:origins>
    </ts:attribute>
`
}

function buildCardXml(card) {
  if (card.type === "token") {
    return `
    <ts:card type="token" name="${card.name}" origins="${card.contractId}">
      <ts:label>
        <ts:string xml:lang="en">${card.name}</ts:string>
      </ts:label>
      <ts:view xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" urlFragment="${card.name.toLowerCase()}">
        <ts:viewContent name="common"/>
      </ts:view>
    </ts:card>
`
  } else {
    // TODO: make this dynamic
    return `
    <ts:card type="action" name="${card.name}" origins="${card.contractId}">
      <ts:label>
        <ts:string xml:lang="en">${card.name}</ts:string>
      </ts:label>
      <ts:transaction>
        <ethereum:transaction contract="${card.contractId}" function="${card.function}" as="uint">
          <ts:data>
            <ts:address ref="sendingAccountAddress"/>
            <ts:address ref="receivingAccountAddress"/>
            <ts:uint256 ref="tokenId"/>
          </ts:data>
        </ethereum:transaction>
      </ts:transaction>

      <ts:view xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" urlFragment="transfer">
        <ts:viewContent name="common"/>
      </ts:view>
    </ts:card>
`
  }
}
