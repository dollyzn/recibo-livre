export type BrazilianCity = {
  label: string
  value: string
}

type IbgeMunicipio = {
  nome: string
  microrregiao?: {
    mesorregiao?: {
      UF?: {
        sigla?: string
      }
    }
  }
}

let citiesPromise: Promise<BrazilianCity[]> | undefined

export async function loadBrazilianCities() {
  if (!citiesPromise) {
    citiesPromise = fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome",
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Não foi possível carregar as cidades.")
        }
        const data = (await response.json()) as IbgeMunicipio[]
        return data.map((city) => {
          const uf = city.microrregiao?.mesorregiao?.UF?.sigla ?? ""
          const label = uf ? `${city.nome} - ${uf}` : city.nome
          return { label, value: label }
        })
      })
      .catch((error) => {
        citiesPromise = undefined
        throw error
      })
  }

  return citiesPromise
}
