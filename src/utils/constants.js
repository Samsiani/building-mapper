export const STATUS = {
  for_sale: {
    label: 'For Sale',
    color: '#22c55e',
    fill: 'rgba(34, 197, 94, 0.25)',
    fillHover: 'rgba(34, 197, 94, 0.50)',
    stroke: '#22c55e',
  },
  for_rent: {
    label: 'For Rent',
    color: '#3b82f6',
    fill: 'rgba(59, 130, 246, 0.25)',
    fillHover: 'rgba(59, 130, 246, 0.50)',
    stroke: '#3b82f6',
  },
  rented: {
    label: 'Rented',
    color: '#a855f7',
    fill: 'rgba(168, 85, 247, 0.25)',
    fillHover: 'rgba(168, 85, 247, 0.50)',
    stroke: '#a855f7',
  },
  reserved: {
    label: 'Reserved',
    color: '#f59e0b',
    fill: 'rgba(245, 158, 11, 0.25)',
    fillHover: 'rgba(245, 158, 11, 0.50)',
    stroke: '#f59e0b',
  },
  sold: {
    label: 'Sold',
    color: '#ef4444',
    fill: 'rgba(239, 68, 68, 0.25)',
    fillHover: 'rgba(239, 68, 68, 0.50)',
    stroke: '#ef4444',
  },
};

export const ORIENTATIONS = ['North', 'South', 'East', 'West', 'NE', 'NW', 'SE', 'SW'];

export const DEFAULT_PROJECT_CONFIG = {
  projectName: 'Residence Azure',
  companyName: 'Azure Developments',
  companyTagline: 'Premium Living, Elevated Design',
  currency: 'EUR',
  contactPhone: '+30 210 123 4567',
  contactEmail: 'info@azure-dev.com',
  siteBackgroundImage: null,
};

export const SEED_NODES = [
  // ─── Building ───
  {
    id: 1,
    parentId: null,
    type: 'building',
    name: 'Building A',
    description: 'Main residential building',
    backgroundImage: null,
    floors: 6,
    unitsPerFloor: 4,
    points: [
      { x: 10, y: 10 },
      { x: 50, y: 10 },
      { x: 50, y: 90 },
      { x: 10, y: 90 },
    ],
  },
  // ─── Floors ───
  {
    id: 2,
    parentId: 1,
    type: 'floor',
    floorNumber: 1,
    name: 'Ground Floor',
    backgroundImage: null,
    points: [
      { x: 15, y: 78 },
      { x: 85, y: 78 },
      { x: 85, y: 92 },
      { x: 15, y: 92 },
    ],
  },
  {
    id: 3,
    parentId: 1,
    type: 'floor',
    floorNumber: 2,
    name: 'Floor 2',
    backgroundImage: null,
    points: [
      { x: 15, y: 64 },
      { x: 85, y: 64 },
      { x: 85, y: 76 },
      { x: 15, y: 76 },
    ],
  },
  {
    id: 4,
    parentId: 1,
    type: 'floor',
    floorNumber: 3,
    name: 'Floor 3',
    backgroundImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLm91dGVyLXdhbGwgeyBmaWxsOiBub25lOyBzdHJva2U6ICM0YTU1Njg7IHN0cm9rZS13aWR0aDogMS4yOyB9CiAgICAgIC5pbm5lci13YWxsIHsgZmlsbDogbm9uZTsgc3Ryb2tlOiAjNzE4MDk2OyBzdHJva2Utd2lkdGg6IDAuNTsgfQogICAgICAuY29ycmlkb3IgeyBmaWxsOiAjZThlMGQ0OyB9CiAgICAgIC5yb29tIHsgZmlsbDogI2Y3ZjNlZTsgfQogICAgICAud2V0IHsgZmlsbDogI2U4ZWRmMjsgfQogICAgICAuYmFsY29ueSB7IGZpbGw6IG5vbmU7IHN0cm9rZTogIzcxODA5Njsgc3Ryb2tlLXdpZHRoOiAwLjM7IHN0cm9rZS1kYXNoYXJyYXk6IDEsMC41OyB9CiAgICAgIC5zdGFpciB7IGZpbGw6ICNlZWU4ZGM7IHN0cm9rZTogIzcxODA5Njsgc3Ryb2tlLXdpZHRoOiAwLjQ7IH0KICAgICAgLmRvb3IgeyBmaWxsOiBub25lOyBzdHJva2U6ICNhMGFlYzA7IHN0cm9rZS13aWR0aDogMC4zOyB9CiAgICAgIC5sYWJlbCB7IGZvbnQtZmFtaWx5OiBBcmlhbCwgc2Fucy1zZXJpZjsgZm9udC1zaXplOiAyLjJweDsgZmlsbDogIzg4OTlhNjsgdGV4dC1hbmNob3I6IG1pZGRsZTsgfQogICAgICAuYXB0LWxhYmVsIHsgZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmOyBmb250LXNpemU6IDNweDsgZmlsbDogIzVhNmI3YTsgdGV4dC1hbmNob3I6IG1pZGRsZTsgZm9udC13ZWlnaHQ6IGJvbGQ7IH0KICAgICAgLmNvcnJpZG9yLWxhYmVsIHsgZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmOyBmb250LXNpemU6IDMuNXB4OyBmaWxsOiAjODg5OWE2OyB0ZXh0LWFuY2hvcjogbWlkZGxlOyBsZXR0ZXItc3BhY2luZzogMnB4OyB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KCiAgPCEtLSBCYWNrZ3JvdW5kIC0tPgogIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmFmOGY1Ii8+CgogIDwhLS0gPT09PT09PT09PT09IE9VVEVSIEJVSUxESU5HIFdBTExTID09PT09PT09PT09PSAtLT4KICA8cmVjdCB4PSI1IiB5PSI4IiB3aWR0aD0iOTAiIGhlaWdodD0iODQiIGNsYXNzPSJvdXRlci13YWxsIiByeD0iMC41Ii8+CgogIDwhLS0gPT09PT09PT09PT09IENPUlJJRE9SICh5PTQ0IHRvIHk9NTYpID09PT09PT09PT09PSAtLT4KICA8cmVjdCB4PSI1IiB5PSI0NCIgd2lkdGg9IjkwIiBoZWlnaHQ9IjEyIiBjbGFzcz0iY29ycmlkb3IiLz4KICA8bGluZSB4MT0iNSIgeTE9IjQ0IiB4Mj0iOTUiIHkyPSI0NCIgY2xhc3M9Im91dGVyLXdhbGwiLz4KICA8bGluZSB4MT0iNSIgeTE9IjU2IiB4Mj0iOTUiIHkyPSI1NiIgY2xhc3M9Im91dGVyLXdhbGwiLz4KICA8dGV4dCB4PSI2MCIgeT0iNTEiIGNsYXNzPSJjb3JyaWRvci1sYWJlbCI+Q09SUklET1I8L3RleHQ+CgogIDwhLS0gPT09PT09PT09PT09IFNUQUlSV0VMTCArIEVMRVZBVE9SIChsZWZ0IGVuZCkgPT09PT09PT09PT09IC0tPgogIDwhLS0gU3RhaXJ3ZWxsIC0tPgogIDxyZWN0IHg9IjUiIHk9IjQ0IiB3aWR0aD0iMTAiIGhlaWdodD0iMTIiIGNsYXNzPSJzdGFpciIvPgogIDxsaW5lIHgxPSI1IiB5MT0iNDQiIHgyPSIxNSIgeTI9IjQ0IiBjbGFzcz0iaW5uZXItd2FsbCIvPgogIDxsaW5lIHgxPSIxNSIgeTE9IjQ0IiB4Mj0iMTUiIHkyPSI1NiIgY2xhc3M9ImlubmVyLXdhbGwiIHN0cm9rZS13aWR0aD0iMC41Ii8+CiAgPCEtLSBTdGFpciB0cmVhZHMgLS0+CiAgPGxpbmUgeDE9IjYiIHkxPSI0NiIgeDI9IjE0IiB5Mj0iNDYiIGNsYXNzPSJpbm5lci13YWxsIi8+CiAgPGxpbmUgeDE9IjYiIHkxPSI0Ny41IiB4Mj0iMTQiIHkyPSI0Ny41IiBjbGFzcz0iaW5uZXItd2FsbCIvPgogIDxsaW5lIHgxPSI2IiB5MT0iNDkiIHgyPSIxNCIgeTI9IjQ5IiBjbGFzcz0iaW5uZXItd2FsbCIvPgogIDxsaW5lIHgxPSI2IiB5MT0iNTAuNSIgeDI9IjE0IiB5Mj0iNTAuNSIgY2xhc3M9ImlubmVyLXdhbGwiLz4KICA8bGluZSB4MT0iNiIgeTE9IjUyIiB4Mj0iMTQiIHkyPSI1MiIgY2xhc3M9ImlubmVyLXdhbGwiLz4KICA8bGluZSB4MT0iNiIgeTE9IjUzLjUiIHgyPSIxNCIgeTI9IjUzLjUiIGNsYXNzPSJpbm5lci13YWxsIi8+CiAgPCEtLSBFbGV2YXRvciAtLT4KICA8cmVjdCB4PSIxNSIgeT0iNDYiIHdpZHRoPSI1IiBoZWlnaHQ9IjYiIHJ4PSIwLjMiIHN0eWxlPSJmaWxsOiNkZGQ4ZDA7IHN0cm9rZTojNzE4MDk2OyBzdHJva2Utd2lkdGg6MC40OyIvPgogIDx0ZXh0IHg9IjE3LjUiIHk9IjQ5LjgiIGNsYXNzPSJsYWJlbCI+RUw8L3RleHQ+CiAgPCEtLSBTdGFpciBsYWJlbCAtLT4KICA8dGV4dCB4PSIxMCIgeT0iNTUiIGNsYXNzPSJsYWJlbCI+U1RBSVJTPC90ZXh0PgoKICA8IS0tID09PT09PT09PT09PSBVUFBFUiBBUEFSVE1FTlRTICh5PTggdG8geT00NCkgPT09PT09PT09PT09IC0tPgoKICA8IS0tIEFQVCAzMDEg4oCUIFRvcC1sZWZ0ICh4PTUgdG8geD0zNSwgeT04IHRvIHk9NDQpIC0tPgogIDxyZWN0IHg9IjUiIHk9IjgiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzNiIgY2xhc3M9InJvb20iLz4KICA8IS0tIEludGVybmFsIHdhbGxzIC0tPgogIDxsaW5lIHgxPSI1IiB5MT0iMjYiIHgyPSIyNSIgeTI9IjI2IiBjbGFzcz0iaW5uZXItd2FsbCIvPgogIDxsaW5lIHgxPSIyNSIgeTE9IjgiIHgyPSIyNSIgeTI9IjI2IiBjbGFzcz0iaW5uZXItd2FsbCIvPgogIDxsaW5lIHgxPSIxNSIgeTE9IjI2IiB4Mj0iMTUiIHkyPSI0NCIgY2xhc3M9ImlubmVyLXdhbGwiLz4KICA8bGluZSB4MT0iMjUiIHkxPSIyNiIgeDI9IjI1IiB5Mj0iNDQiIGNsYXNzPSJpbm5lci13YWxsIi8+CiAgPCEtLSBXZXQgYXJlYXMgLS0+CiAgPHJlY3QgeD0iMTUiIHk9IjI2IiB3aWR0aD0iMTAiIGhlaWdodD0iMTgiIGNsYXNzPSJ3ZXQiLz4KICA8cmVjdCB4PSIyNSIgeT0iOCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjE4IiBjbGFzcz0id2V0Ii8+CiAgPCEtLSBEb29yIGFyY3MgLS0+CiAgPHBhdGggZD0iTSAxNSAzOCBBIDQgNCAwIDAgMSAxOSA0MiIgY2xhc3M9ImRvb3IiLz4KICA8cGF0aCBkPSJNIDI1IDMwIEEgNCA0IDAgMCAwIDIxIDI2IiBjbGFzcz0iZG9vciIvPgogIDxwYXRoIGQ9Ik0gMjUgMTIgQSA0IDQgMCAwIDEgMjkgOCIgY2xhc3M9ImRvb3IiLz4KICA8IS0tIEJhbGNvbnkgdG9wIC0tPgogIDxyZWN0IHg9IjYiIHk9IjQiIHdpZHRoPSIxNCIgaGVpZ2h0PSI0IiBjbGFzcz0iYmFsY29ueSIvPgogIDwhLS0gTGFiZWxzIC0tPgogIDx0ZXh0IHg9IjE1IiB5PSIxOCIgY2xhc3M9ImFwdC1sYWJlbCI+MzAxPC90ZXh0PgogIDx0ZXh0IHg9IjEyIiB5PSIxNiIgY2xhc3M9ImxhYmVsIj5MUjwvdGV4dD4KICA8dGV4dCB4PSIzMCIgeT0iMTQiIGNsYXNzPSJsYWJlbCI+SzwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iMzYiIGNsYXNzPSJsYWJlbCI+V0M8L3RleHQ+CiAgPHRleHQgeD0iMTAiIHk9IjM2IiBjbGFzcz0ibGFiZWwiPkJSPC90ZXh0PgogIDx0ZXh0IHg9IjI4IiB5PSIzNiIgY2xhc3M9ImxhYmVsIj5CUjwvdGV4dD4KICA8IS0tIFJpZ2h0IGJvdW5kYXJ5IC0tPgogIDxsaW5lIHgxPSIzNSIgeTE9IjgiIHgyPSIzNSIgeTI9IjQ0IiBjbGFzcz0ib3V0ZXItd2FsbCIvPgoKICA8IS0tIEFQVCAzMDIg4oCUIFRvcC1jZW50ZXIgKHg9MzUgdG8geD02NSwgeT04IHRvIHk9NDQpIOKAlCBsYXJnZXIgLS0+CiAgPHJlY3QgeD0iMzUiIHk9IjgiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzNiIgY2xhc3M9InJvb20iLz4KICA8IS0tIEludGVybmFsIHdhbGxzIC0tPgogIDxsaW5lIHgxPSIzNSIgeTE9IjI4IiB4Mj0iNTUiIHkyPSIyOCIgY2xhc3M9ImlubmVyLXdhbGwiLz4KICA8bGluZSB4MT0iNTUiIHkxPSI4IiB4Mj0iNTUiIHkyPSIyOCIgY2xhc3M9ImlubmVyLXdhbGwiLz4KICA8bGluZSB4MT0iNDUiIHkxPSIyOCIgeDI9IjQ1IiB5Mj0iNDQiIGNsYXNzPSJpbm5lci13YWxsIi8+CiAgPGxpbmUgeDE9IjU1IiB5MT0iMjgiIHgyPSI1NSIgeTI9IjQ0IiBjbGFzcz0iaW5uZXItd2FsbCIvPgogIDxsaW5lIHgxPSIzNSIgeTE9IjM2IiB4Mj0iNDUiIHkyPSIzNiIgY2xhc3M9ImlubmVyLXdhbGwiLz4KICA8IS0tIFdldCBhcmVhcyAtLT4KICA8cmVjdCB4PSI1NSIgeT0iOCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjIwIiBjbGFzcz0id2V0Ii8+CiAgPHJlY3QgeD0iNDUiIHk9IjI4IiB3aWR0aD0iMTAiIGhlaWdodD0iMTYiIGNsYXNzPSJ3ZXQiLz4KICA8IS0tIERvb3IgYXJjcyAtLT4KICA8cGF0aCBkPSJNIDQ1IDMyIEEgNCA0IDAgMCAwIDQxIDI4IiBjbGFzcz0iZG9vciIvPgogIDxwYXRoIGQ9Ik0gNTUgMTQgQSA0IDQgMCAwIDEgNTkgMTAiIGNsYXNzPSJkb29yIi8+CiAgPHBhdGggZD0iTSA1NSAzMiBBIDQgNCAwIDAgMSA1MSAyOCIgY2xhc3M9ImRvb3IiLz4KICA8IS0tIEJhbGNvbnkgdG9wIC0tPgogIDxyZWN0IHg9IjM3IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iNCIgY2xhc3M9ImJhbGNvbnkiLz4KICA8IS0tIExhYmVscyAtLT4KICA8dGV4dCB4PSI0NyIgeT0iMTkiIGNsYXNzPSJhcHQtbGFiZWwiPjMwMjwvdGV4dD4KICA8dGV4dCB4PSI0NSIgeT0iMTciIGNsYXNzPSJsYWJlbCI+TFI8L3RleHQ+CiAgPHRleHQgeD0iNTgiIHk9IjE2IiBjbGFzcz0ibGFiZWwiPks8L3RleHQ+CiAgPHRleHQgeD0iNTAiIHk9IjM4IiBjbGFzcz0ibGFiZWwiPldDPC90ZXh0PgogIDx0ZXh0IHg9IjQwIiB5PSIzOCIgY2xhc3M9ImxhYmVsIj5CUjwvdGV4dD4KICA8dGV4dCB4PSI2MCIgeT0iMzgiIGNsYXNzPSJsYWJlbCI+QlI8L3RleHQ+CiAgPHRleHQgeD0iNDAiIHk9IjMyIiBjbGFzcz0ibGFiZWwiPkJSPC90ZXh0PgogIDwhLS0gUmlnaHQgYm91bmRhcnkgLS0+CiAgPGxpbmUgeDE9IjY1IiB5MT0iOCIgeDI9IjY1IiB5Mj0iNDQiIGNsYXNzPSJvdXRlci13YWxsIi8+CgogIDwhLS0gQVBUIDMwMyDigJQgVG9wLXJpZ2h0ICh4PTY1IHRvIHg9OTUsIHk9OCB0byB5PTQ0KSAtLT4KICA8cmVjdCB4PSI2NSIgeT0iOCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjM2IiBjbGFzcz0icm9vbSIvPgogIDwhLS0gSW50ZXJuYWwgd2FsbHMgLS0+CiAgPGxpbmUgeDE9IjY1IiB5MT0iMjYiIHgyPSI4NSIgeTI9IjI2IiBjbGFzcz0iaW5uZXItd2FsbCIvPgogIDxsaW5lIHgxPSI4NSIgeTE9IjgiIHgyPSI4NSIgeTI9IjI2IiBjbGFzcz0iaW5uZXItd2FsbCIvPgogIDxsaW5lIHgxPSI3NSIgeTE9IjI2IiB4Mj0iNzUiIHkyPSI0NCIgY2xhc3M9ImlubmVyLXdhbGwiLz4KICA8IS0tIFdldCBhcmVhcyAtLT4KICA8cmVjdCB4PSI4NSIgeT0iOCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjE4IiBjbGFzcz0id2V0Ii8+CiAgPHJlY3QgeD0iNzUiIHk9IjI2IiB3aWR0aD0iMTAiIGhlaWdodD0iMTgiIGNsYXNzPSJ3ZXQiLz4KICA8IS0tIERvb3IgYXJjcyAtLT4KICA8cGF0aCBkPSJNIDc1IDM4IEEgNCA0IDAgMCAxIDc5IDQyIiBjbGFzcz0iZG9vciIvPgogIDxwYXRoIGQ9Ik0gODUgMTIgQSA0IDQgMCAwIDEgODkgOCIgY2xhc3M9ImRvb3IiLz4KICA8IS0tIExhYmVscyAtLT4KICA8dGV4dCB4PSI3OCIgeT0iMTgiIGNsYXNzPSJhcHQtbGFiZWwiPjMwMzwvdGV4dD4KICA8dGV4dCB4PSI3NSIgeT0iMTYiIGNsYXNzPSJsYWJlbCI+TFI8L3RleHQ+CiAgPHRleHQgeD0iOTAiIHk9IjE0IiBjbGFzcz0ibGFiZWwiPks8L3RleHQ+CiAgPHRleHQgeD0iODAiIHk9IjM2IiBjbGFzcz0ibGFiZWwiPldDPC90ZXh0PgogIDx0ZXh0IHg9IjcwIiB5PSIzNiIgY2xhc3M9ImxhYmVsIj5CUjwvdGV4dD4KCiAgPCEtLSA9PT09PT09PT09PT0gTE9XRVIgQVBBUlRNRU5UUyAoeT01NiB0byB5PTkyKSA9PT09PT09PT09PT0gLS0+CgogIDwhLS0gQVBUIDMwNCDigJQgQm90dG9tLWxlZnQgKHg9NSB0byB4PTM1LCB5PTU2IHRvIHk9OTIpIC0tPgogIDxyZWN0IHg9IjUiIHk9IjU2IiB3aWR0aD0iMzAiIGhlaWdodD0iMzYiIGNsYXNzPSJyb29tIi8+CiAgPCEtLSBJbnRlcm5hbCB3YWxscyAtLT4KICA8bGluZSB4MT0iNSIgeTE9Ijc0IiB4Mj0iMjUiIHkyPSI3NCIgY2xhc3M9ImlubmVyLXdhbGwiLz4KICA8bGluZSB4MT0iMjUiIHkxPSI1NiIgeDI9IjI1IiB5Mj0iNzQiIGNsYXNzPSJpbm5lci13YWxsIi8+CiAgPGxpbmUgeDE9IjE1IiB5MT0iNzQiIHgyPSIxNSIgeTI9IjkyIiBjbGFzcz0iaW5uZXItd2FsbCIvPgogIDxsaW5lIHgxPSIyNSIgeTE9Ijc0IiB4Mj0iMjUiIHkyPSI5MiIgY2xhc3M9ImlubmVyLXdhbGwiLz4KICA8IS0tIFdldCBhcmVhcyAtLT4KICA8cmVjdCB4PSIyNSIgeT0iNTYiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxOCIgY2xhc3M9IndldCIvPgogIDxyZWN0IHg9IjE1IiB5PSI3NCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjE4IiBjbGFzcz0id2V0Ii8+CiAgPCEtLSBEb29yIGFyY3MgLS0+CiAgPHBhdGggZD0iTSAxNSA3OCBBIDQgNCAwIDAgMCAxOSA3NCIgY2xhc3M9ImRvb3IiLz4KICA8cGF0aCBkPSJNIDI1IDYwIEEgNCA0IDAgMCAwIDI5IDU2IiBjbGFzcz0iZG9vciIvPgogIDwhLS0gQmFsY29ueSBib3R0b20gLS0+CiAgPHJlY3QgeD0iNiIgeT0iOTIiIHdpZHRoPSIxNCIgaGVpZ2h0PSI0IiBjbGFzcz0iYmFsY29ueSIvPgogIDwhLS0gTGFiZWxzIC0tPgogIDx0ZXh0IHg9IjE1IiB5PSI2NiIgY2xhc3M9ImFwdC1sYWJlbCI+MzA0PC90ZXh0PgogIDx0ZXh0IHg9IjEyIiB5PSI2NCIgY2xhc3M9ImxhYmVsIj5MUjwvdGV4dD4KICA8dGV4dCB4PSIzMCIgeT0iNjQiIGNsYXNzPSJsYWJlbCI+SzwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iODQiIGNsYXNzPSJsYWJlbCI+V0M8L3RleHQ+CiAgPHRleHQgeD0iMTAiIHk9Ijg0IiBjbGFzcz0ibGFiZWwiPkJSPC90ZXh0PgogIDx0ZXh0IHg9IjI4IiB5PSI4NCIgY2xhc3M9ImxhYmVsIj5CUjwvdGV4dD4KICA8IS0tIFJpZ2h0IGJvdW5kYXJ5IC0tPgogIDxsaW5lIHgxPSIzNSIgeTE9IjU2IiB4Mj0iMzUiIHkyPSI5MiIgY2xhc3M9Im91dGVyLXdhbGwiLz4KCiAgPCEtLSBBUFQgMzA1IOKAlCBCb3R0b20tY2VudGVyICh4PTM1IHRvIHg9NjUsIHk9NTYgdG8geT05MikgLS0+CiAgPHJlY3QgeD0iMzUiIHk9IjU2IiB3aWR0aD0iMzAiIGhlaWdodD0iMzYiIGNsYXNzPSJyb29tIi8+CiAgPCEtLSBJbnRlcm5hbCB3YWxscyAtLT4KICA8bGluZSB4MT0iMzUiIHkxPSI3NCIgeDI9IjU1IiB5Mj0iNzQiIGNsYXNzPSJpbm5lci13YWxsIi8+CiAgPGxpbmUgeDE9IjU1IiB5MT0iNTYiIHgyPSI1NSIgeTI9Ijc0IiBjbGFzcz0iaW5uZXItd2FsbCIvPgogIDxsaW5lIHgxPSI1MCIgeTE9Ijc0IiB4Mj0iNTAiIHkyPSI5MiIgY2xhc3M9ImlubmVyLXdhbGwiLz4KICA8IS0tIFdldCBhcmVhcyAtLT4KICA8cmVjdCB4PSI1NSIgeT0iNTYiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxOCIgY2xhc3M9IndldCIvPgogIDxyZWN0IHg9IjUwIiB5PSI3NCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE4IiBjbGFzcz0id2V0Ii8+CiAgPCEtLSBEb29yIGFyY3MgLS0+CiAgPHBhdGggZD0iTSA1MCA3OCBBIDQgNCAwIDAgMCA1NCA3NCIgY2xhc3M9ImRvb3IiLz4KICA8cGF0aCBkPSJNIDU1IDYwIEEgNCA0IDAgMCAwIDU5IDU2IiBjbGFzcz0iZG9vciIvPgogIDwhLS0gTGFiZWxzIC0tPgogIDx0ZXh0IHg9IjQ3IiB5PSI2NiIgY2xhc3M9ImFwdC1sYWJlbCI+MzA1PC90ZXh0PgogIDx0ZXh0IHg9IjQ1IiB5PSI2NCIgY2xhc3M9ImxhYmVsIj5MUjwvdGV4dD4KICA8dGV4dCB4PSI1OCIgeT0iNjQiIGNsYXNzPSJsYWJlbCI+SzwvdGV4dD4KICA8dGV4dCB4PSI1NSIgeT0iODQiIGNsYXNzPSJsYWJlbCI+V0M8L3RleHQ+CiAgPHRleHQgeD0iNDIiIHk9Ijg0IiBjbGFzcz0ibGFiZWwiPkJSPC90ZXh0PgoKICA8IS0tIFJpZ2h0IGJvdW5kYXJ5IC0tPgogIDxsaW5lIHgxPSI2NSIgeTE9IjU2IiB4Mj0iNjUiIHkyPSI5MiIgY2xhc3M9Im91dGVyLXdhbGwiLz4KCiAgPCEtLSBBUFQgMzA2IOKAlCBCb3R0b20tcmlnaHQgKHg9NjUgdG8geD05NSwgeT01NiB0byB5PTkyKSAtLT4KICA8cmVjdCB4PSI2NSIgeT0iNTYiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzNiIgY2xhc3M9InJvb20iLz4KICA8IS0tIEludGVybmFsIHdhbGxzIC0tPgogIDxsaW5lIHgxPSI2NSIgeTE9Ijc0IiB4Mj0iODUiIHkyPSI3NCIgY2xhc3M9ImlubmVyLXdhbGwiLz4KICA8bGluZSB4MT0iODUiIHkxPSI1NiIgeDI9Ijg1IiB5Mj0iNzQiIGNsYXNzPSJpbm5lci13YWxsIi8+CiAgPGxpbmUgeDE9Ijc1IiB5MT0iNzQiIHgyPSI3NSIgeTI9IjkyIiBjbGFzcz0iaW5uZXItd2FsbCIvPgogIDxsaW5lIHgxPSI4NSIgeTE9Ijc0IiB4Mj0iODUiIHkyPSI5MiIgY2xhc3M9ImlubmVyLXdhbGwiLz4KICA8bGluZSB4MT0iNjUiIHkxPSI4MiIgeDI9Ijc1IiB5Mj0iODIiIGNsYXNzPSJpbm5lci13YWxsIi8+CiAgPCEtLSBXZXQgYXJlYXMgLS0+CiAgPHJlY3QgeD0iODUiIHk9IjU2IiB3aWR0aD0iMTAiIGhlaWdodD0iMTgiIGNsYXNzPSJ3ZXQiLz4KICA8cmVjdCB4PSI3NSIgeT0iNzQiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxOCIgY2xhc3M9IndldCIvPgogIDwhLS0gRG9vciBhcmNzIC0tPgogIDxwYXRoIGQ9Ik0gNzUgNzggQSA0IDQgMCAwIDAgNzkgNzQiIGNsYXNzPSJkb29yIi8+CiAgPHBhdGggZD0iTSA4NSA2MCBBIDQgNCAwIDAgMCA4OSA1NiIgY2xhc3M9ImRvb3IiLz4KICA8cGF0aCBkPSJNIDc1IDg2IEEgNCA0IDAgMCAxIDcxIDgyIiBjbGFzcz0iZG9vciIvPgogIDwhLS0gQmFsY29ueSBib3R0b20gLS0+CiAgPHJlY3QgeD0iODAiIHk9IjkyIiB3aWR0aD0iMTQiIGhlaWdodD0iNCIgY2xhc3M9ImJhbGNvbnkiLz4KICA8IS0tIExhYmVscyAtLT4KICA8dGV4dCB4PSI3OCIgeT0iNjYiIGNsYXNzPSJhcHQtbGFiZWwiPjMwNjwvdGV4dD4KICA8dGV4dCB4PSI3NSIgeT0iNjQiIGNsYXNzPSJsYWJlbCI+TFI8L3RleHQ+CiAgPHRleHQgeD0iOTAiIHk9IjY0IiBjbGFzcz0ibGFiZWwiPks8L3RleHQ+CiAgPHRleHQgeD0iODAiIHk9Ijg0IiBjbGFzcz0ibGFiZWwiPldDPC90ZXh0PgogIDx0ZXh0IHg9IjcwIiB5PSI4NCIgY2xhc3M9ImxhYmVsIj5CUjwvdGV4dD4KICA8dGV4dCB4PSI3MCIgeT0iNzgiIGNsYXNzPSJsYWJlbCI+QlI8L3RleHQ+CiAgPHRleHQgeD0iODgiIHk9Ijg0IiBjbGFzcz0ibGFiZWwiPkJSPC90ZXh0PgoKICA8IS0tID09PT09PT09PT09PSBBUEFSVE1FTlQgU0VQQVJBVE9SIFdBTExTIChoZWF2aWVyKSA9PT09PT09PT09PT0gLS0+CiAgPGxpbmUgeDE9IjM1IiB5MT0iOCIgeDI9IjM1IiB5Mj0iNDQiIHN0eWxlPSJzdHJva2U6IzRhNTU2ODsgc3Ryb2tlLXdpZHRoOjAuODsiLz4KICA8bGluZSB4MT0iNjUiIHkxPSI4IiB4Mj0iNjUiIHkyPSI0NCIgc3R5bGU9InN0cm9rZTojNGE1NTY4OyBzdHJva2Utd2lkdGg6MC44OyIvPgogIDxsaW5lIHgxPSIzNSIgeTE9IjU2IiB4Mj0iMzUiIHkyPSI5MiIgc3R5bGU9InN0cm9rZTojNGE1NTY4OyBzdHJva2Utd2lkdGg6MC44OyIvPgogIDxsaW5lIHgxPSI2NSIgeTE9IjU2IiB4Mj0iNjUiIHkyPSI5MiIgc3R5bGU9InN0cm9rZTojNGE1NTY4OyBzdHJva2Utd2lkdGg6MC44OyIvPgoKPC9zdmc+',
    points: [
      { x: 15, y: 50 },
      { x: 85, y: 50 },
      { x: 85, y: 62 },
      { x: 15, y: 62 },
    ],
  },
  // ─── Apartments (were "units") ───
  // Ground Floor
  {
    id: 5, parentId: 2, type: 'apartment',
    name: 'Unit A-101', area: 85, price: 245000, rooms: 3,
    balcony: true, orientation: 'South', status: 'for_sale',
    notes: 'Corner unit with sea view',
    points: [{ x: 16, y: 78 }, { x: 32, y: 78 }, { x: 32, y: 91 }, { x: 16, y: 91 }],
  },
  // Floor 2
  {
    id: 6, parentId: 3, type: 'apartment',
    name: 'Unit A-201', area: 110, price: 320000, rooms: 4,
    balcony: true, orientation: 'East', status: 'reserved',
    notes: 'Penthouse duplex',
    points: [{ x: 34, y: 23 }, { x: 49, y: 23 }, { x: 49, y: 34.5 }, { x: 42, y: 34.5 }, { x: 34, y: 30 }],
  },
  {
    id: 7, parentId: 2, type: 'apartment',
    name: 'Unit A-102', area: 65, price: 185000, rooms: 2,
    balcony: false, orientation: 'West', status: 'sold', notes: '',
    points: [{ x: 51, y: 78 }, { x: 66, y: 78 }, { x: 66, y: 91 }, { x: 51, y: 91 }],
  },
  // Floor 3 — Showcase apartments
  {
    id: 8, parentId: 4, type: 'apartment',
    name: 'Apt 301', area: 85, price: 285000, rooms: 3,
    balcony: true, orientation: 'South', status: 'for_sale',
    notes: 'Corner apartment with balcony, 3 bedrooms',
    points: [{ x: 5, y: 8 }, { x: 35, y: 8 }, { x: 35, y: 44 }, { x: 5, y: 44 }],
  },
  {
    id: 9, parentId: 4, type: 'apartment',
    name: 'Apt 302', area: 110, price: 345000, rooms: 4,
    balcony: true, orientation: 'South', status: 'reserved',
    notes: 'Spacious 4-bedroom with large living room',
    points: [{ x: 35, y: 8 }, { x: 65, y: 8 }, { x: 65, y: 44 }, { x: 35, y: 44 }],
  },
  {
    id: 10, parentId: 4, type: 'apartment',
    name: 'Apt 303', area: 72, price: 225000, rooms: 2,
    balcony: false, orientation: 'SE', status: 'sold',
    notes: 'Compact 2-bedroom, southeast corner',
    points: [{ x: 65, y: 8 }, { x: 95, y: 8 }, { x: 95, y: 44 }, { x: 65, y: 44 }],
  },
  {
    id: 11, parentId: 4, type: 'apartment',
    name: 'Apt 304', area: 95, price: 310000, rooms: 3,
    balcony: true, orientation: 'North', status: 'for_sale',
    notes: '3-bedroom with garden-facing balcony',
    points: [{ x: 5, y: 56 }, { x: 35, y: 56 }, { x: 35, y: 92 }, { x: 5, y: 92 }],
  },
  {
    id: 12, parentId: 4, type: 'apartment',
    name: 'Apt 305', area: 68, price: 215000, rooms: 2,
    balcony: false, orientation: 'North', status: 'reserved',
    notes: 'Cozy 2-bedroom, north facing',
    points: [{ x: 35, y: 56 }, { x: 65, y: 56 }, { x: 65, y: 92 }, { x: 35, y: 92 }],
  },
  {
    id: 13, parentId: 4, type: 'apartment',
    name: 'Apt 306', area: 105, price: 335000, rooms: 4,
    balcony: true, orientation: 'NW', status: 'sold',
    notes: 'Large 4-bedroom corner with balcony',
    points: [{ x: 65, y: 56 }, { x: 95, y: 56 }, { x: 95, y: 92 }, { x: 65, y: 92 }],
  },
];

export const TOOLS = [
  { id: 'select', label: 'Select', key: 'V' },
  { id: 'pen', label: 'Pen', key: 'P' },
  { id: 'edit', label: 'Edit', key: 'E' },
  { id: 'hand', label: 'Hand', key: 'H' },
  { id: 'measure', label: 'Measure', key: 'M' },
];

// Building geometry constants (inside 0 0 100 100 viewBox)
export const BUILDING = {
  LEFT: 15,
  RIGHT: 85,
  TOP: 8,
  BOTTOM: 92,
  get WIDTH() { return this.RIGHT - this.LEFT; },
  get HEIGHT() { return this.BOTTOM - this.TOP; },
};
