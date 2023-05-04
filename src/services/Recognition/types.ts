export interface ClarifaiResponse {
  outputs: Output[]
  status: Status
}

export interface Output {
  id: string
  status: Status
  created_at: EdAt
  model: Model
  input: Input
  data: Data
}

export interface EdAt {
  seconds: string
  nanos: number
}

export interface Data {
  concepts: Concept[]
  colors: any[]
  clusters: any[]
  embeddings: any[]
  regions: any[]
  frames: any[]
  tracks: any[]
  time_segments: any[]
  hits: any[]
  image: DataImage | null
  video: null
  metadata: null
  geo: null
  text: null
  audio: null
}

export interface Concept {
  id: string
  name: string
  value: number
  created_at: null
  language: string
  app_id: AppID
  definition: string
  vocab_id: string
  visibility: null
  user_id: string
}

export enum AppID {
  Main = 'main',
}

export interface DataImage {
  url: string
  base64: Base64
  allow_duplicate_url: boolean
  hosted: null
  image_info: null
}

export interface Base64 {
  type: string
  data: number[]
}

export interface Input {
  dataset_ids: any[]
  id: string
  data: Data
  created_at: null
  modified_at: null
  status: null
}

export interface Model {
  toolkits: any[]
  use_cases: any[]
  languages: any[]
  id: string
  name: string
  created_at: EdAt
  app_id: AppID
  output_info: OutputInfo
  model_version: ModelVersion
  display_name: string
  user_id: string
  input_info: InputInfo
  train_info: Info
  model_type_id: string
  visibility: Visibility
  description: string
  metadata: null
  notes: string
  modified_at: EdAt
  is_starred: boolean
  star_count: number
  import_info: Info
}

export interface Info {
  params: null
}

export interface InputInfo {
  fields_map: InputInfoFieldsMap
  params: null
}

export interface InputInfoFieldsMap {
  fields: PurpleFields
}

export interface PurpleFields {
  image: ConceptsClass
}

export interface ConceptsClass {
  stringValue: string
  kind: string
}

export interface ModelVersion {
  id: string
  created_at: EdAt
  status: Status
  active_concept_count: number
  metrics: null
  total_input_count: number
  completed_at: null
  description: string
  visibility: Visibility
  app_id: AppID
  user_id: string
  modified_at: null
  metadata: Metadata
  license: string
  dataset_version: null
}

export interface Metadata {
  fields: unknown
}

export interface Status {
  stack_trace: any[]
  code: number
  description: string
  details: string
  percent_completed: number
  time_remaining: number
  req_id: string
  internal_details: string
}

export interface Visibility {
  gettable: number
}

export interface OutputInfo {
  data: null
  output_config: OutputConfig
  message: string
  fields_map: OutputInfoFieldsMap
  params: null
}

export interface OutputInfoFieldsMap {
  fields: FluffyFields
}

export interface FluffyFields {
  concepts: ConceptsClass
}

export interface OutputConfig {
  select_concepts: any[]
  concepts_mutually_exclusive: boolean
  closed_environment: boolean
  existing_model_id: string
  language: string
  hyper_parameters: string
  max_concepts: number
  min_value: number
  training_timeout: number
  sample_ms: number
  hyper_params: null
  embed_model_version_id: string
  fail_on_missing_positive_examples: boolean
  model_metadata: null
}
