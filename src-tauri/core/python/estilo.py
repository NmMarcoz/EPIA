import plotly.graph_objects as go

# Paleta de cores (sem alterações)
class Colors:
    PRIMARY = '#4dabf7'
    PRIMARY_VARIANTS = ['#4dabf7', '#74c0fc', '#339af0', '#1c7ed6', '#1864ab']
    BACKGROUND_MAIN = '#121212'
    BACKGROUND_SECONDARY = '#1e1e1e'
    BACKGROUND_TERTIARY = '#2e2e2e'
    TEXT_PRIMARY = '#e0e0e0'
    TEXT_SECONDARY = '#a0a0a0'
    ACCENT_DANGER = '#ff8787'
    BORDER = '#333333'
    HOVER_BG = '#252525'

# Função para estilizar gráficos (sem alterações)
def estilizar_grafico(fig):
    """Aplica estilização padrão aos gráficos Plotly"""
    fig.update_layout(
        plot_bgcolor=Colors.BACKGROUND_SECONDARY,
        paper_bgcolor=Colors.BACKGROUND_SECONDARY,
        font=dict(color=Colors.TEXT_PRIMARY, family="'Inter', sans-serif"),
        title_font=dict(color=Colors.PRIMARY, size=18),
        legend=dict(
            bgcolor='rgba(0,0,0,0)',
            font=dict(color=Colors.TEXT_PRIMARY),
            orientation='h',
            yanchor='bottom',
            y=-0.3,
            xanchor='center',
            x=0.5
        ),
        margin=dict(l=20, r=20, t=40, b=20),
        xaxis=dict(
            showgrid=True,
            gridcolor=Colors.BORDER,
            linecolor=Colors.BORDER,
            zerolinecolor=Colors.BORDER
        ),
        yaxis=dict(
            showgrid=True,
            gridcolor=Colors.BORDER,
            linecolor=Colors.BORDER,
            zerolinecolor=Colors.BORDER
        ),
        hoverlabel=dict(
            bgcolor=Colors.BACKGROUND_TERTIARY,
            font_size=12,
            font_family="'Inter', sans-serif"
        ),
        transition={'duration': 300}
    )
    
    for i, trace in enumerate(fig.data):
        if isinstance(trace, (go.Bar, go.Scatter)):
            if not trace.marker.color: # Evita sobreescrever cores já definidas
                trace.marker.color = Colors.PRIMARY_VARIANTS[i % len(Colors.PRIMARY_VARIANTS)]
            if hasattr(trace, 'line') and not trace.line.color:
                trace.line.color = Colors.PRIMARY_VARIANTS[i % len(Colors.PRIMARY_VARIANTS)]
    
    return fig

# Estilos de layout
class LayoutStyles:
    MAIN_CONTAINER = {
        'minHeight': '100vh',
        'backgroundColor': Colors.BACKGROUND_MAIN,
        'color': Colors.TEXT_PRIMARY,
        'fontFamily': "'Inter', sans-serif",
    }
    
    HEADER = {
        'padding': '1.5rem 2rem',
        'borderBottom': f'1px solid {Colors.BORDER}',
        'background': Colors.BACKGROUND_SECONDARY
    }
    
    HEADER_TITLE = {
        'color': Colors.PRIMARY,
        'fontWeight': '300',
        'margin': '0',
        'fontSize': '1.8rem'
    }
    
    HEADER_SUBTITLE = {
        'color': Colors.TEXT_SECONDARY,
        'margin': '0.25rem 0 0 0',
        'fontSize': '0.9rem'
    }

    # CÓDIGO ADICIONADO AQUI
    NAV_LINK = {
        'color': Colors.TEXT_SECONDARY,
        'textDecoration': 'none',
        'padding': '0.5rem 1rem',
        'borderRadius': '4px',
        'transition': 'background-color 0.2s, color 0.2s'
        # Estilos para quando o mouse passar por cima podem ser adicionados via callback no app
    }
    
# Estilos de filtros (sem alterações)
class FilterStyles:
    # ... (seu código de FilterStyles permanece o mesmo) ...
    CONTAINER = {
        'padding': '1rem 2rem',
        'background': Colors.BACKGROUND_SECONDARY,
        'margin': '1.5rem 2rem 0',
        'borderRadius': '8px',
        'boxShadow': '0 2px 8px rgba(0,0,0,0.1)'
    }
    
    GRID = {
        'display': 'grid',
        'gridTemplateColumns': 'repeat(auto-fill, minmax(250px, 1fr))',
        'gap': '1rem',
        'alignItems': 'end'
    }
    
    LABEL = {
        'display': 'block',
        'marginBottom': '0.5rem',
        'fontSize': '0.85rem'
    }
    
    INPUT = {
        'width': '100%',
        'padding': '0.5rem',
        'background': Colors.BACKGROUND_TERTIARY,
        'border': f'1px solid {Colors.BORDER}',
        'color': Colors.TEXT_PRIMARY,
        'borderRadius': '4px'
    }
    
    DROPDOWN = {
        'background': Colors.BACKGROUND_TERTIARY,
        'color': Colors.TEXT_PRIMARY
    }
    
    BUTTON = {
        'background': Colors.PRIMARY,
        'color': 'white',
        'border': 'none',
        'padding': '0.5rem 1rem',
        'borderRadius': '4px',
        'cursor': 'pointer',
        'display': 'flex',
        'alignItems': 'center',
        'gap': '0.5rem',
        'height': 'fit-content'
    }
    
    UPDATE_INFO = {
        'marginTop': '1rem',
        'fontSize': '0.75rem',
        'color': Colors.TEXT_SECONDARY,
        'textAlign': 'right'
    }

# Estilos de grid e cards (sem alterações)
class GridStyles:
    # ... (seu código de GridStyles permanece o mesmo) ...
    CONTAINER = {
        'display': 'grid',
        'gridTemplateColumns': 'repeat(auto-fill, minmax(400px, 1fr))',
        'gap': '20px',
        'padding': '20px',
        'flex': '1'
    }
    
    CARD = {
        'backgroundColor': Colors.BACKGROUND_SECONDARY,
        'borderRadius': '8px',
        'padding': '15px',
        'boxShadow': '0 2px 8px rgba(0,0,0,0.1)',
        'display': 'flex',
        'flexDirection': 'column'
    }
    
    CARD_TITLE = {
        'marginTop': '0',
        'marginBottom': '15px'
    }
    
    CARD_CONTENT = {
        'flex': 1,
        'width': '100%'
    }

# Estilos de tabelas (sem alterações)
class TableStyles:
    # ... (seu código de TableStyles permanece o mesmo) ...
    CONTAINER = {
        'backgroundColor': Colors.BACKGROUND_SECONDARY,
        'borderRadius': '8px',
        'padding': '15px',
        'boxShadow': '0 2px 8px rgba(0,0,0,0.1)'
    }
    
    TITLE = {
        'fontWeight': '400',
        'marginTop': '0',
        'borderBottom': f'1px solid {Colors.BORDER}',
        'paddingBottom': '0.5rem'
    }
    
    TABLE = {
        'overflowX': 'auto'
    }
    
    HEADER = {
        'backgroundColor': Colors.BACKGROUND_TERTIARY,
        'color': Colors.TEXT_PRIMARY,
        'fontWeight': '400',
        'border': 'none'
    }
    
    CELL = {
        'backgroundColor': Colors.BACKGROUND_SECONDARY,
        'color': Colors.TEXT_PRIMARY,
        'border': 'none',
        'padding': '8px'
    }
    
    CONDITIONAL = [
        {
            'if': {'row_index': 'odd'},
            'backgroundColor': Colors.HOVER_BG
        }
    ]

# Função helper para criar cards (sem alterações)
def create_card_style(width=1):
    """Retorna estilo de card com largura personalizada"""
    style = GridStyles.CARD.copy()
    style['gridColumn'] = f'span {width}'
    return style

# Função helper para cor de título (sem alterações)
def get_title_color(type='primary'):
    """Retorna cor do título baseada no tipo"""
    colors = {
        'primary': Colors.PRIMARY,
        'danger': Colors.ACCENT_DANGER,
        'secondary': Colors.TEXT_SECONDARY
    }
    return colors.get(type, Colors.PRIMARY)