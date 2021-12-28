from tethys_sdk.base import TethysAppBase, url_map_maker


class Droughtnp(TethysAppBase):
    """
    Tethys app class for Droughtnp.
    """

    name = 'Drought Watch - Nepal'
    index = 'droughtnp:Home'
    icon = 'droughtnp/images/icon.gif'
    package = 'droughtnp'
    root_url = 'droughtnp'
    color = '#2c3e50'
    description = ''
    tags = 'Drought-Watch'
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='Home',
                url='droughtnp',
                controller='droughtnp.controllers.Current.home'
            ),UrlMap(
                name='CurrentHome',
                url='droughtnp/current',
                controller='droughtnp.controllers.Current.home'
            ), UrlMap(
                name='SeasonalHome',
                url='droughtnp/seasonal',
                controller='droughtnp.controllers.Seasonal.home'
            ), UrlMap(
                name='OutlookHome',
                url='droughtnp/outlook',
                controller='droughtnp.controllers.Outlook.home'
            ),
            UrlMap(
                name='geomList',
                url='api/getGeomList',
                controller='droughtnp.api.getGeomList'
            ),
            UrlMap(
                name='Stats',
                url='api/getJsonFromAPI',
                controller='droughtnp.api.getJsonFromBLDAS'
            ),
            UrlMap(
                name='AreaUnder',
                url='api/getAreaUnder',
                controller='droughtnp.api.getAreaUnderFromBLDAS'
            ),
            UrlMap(
                name='LTAstats',
                url='api/getLTAStats',
                controller='droughtnp.api.getLTAStats'
            ),
            UrlMap(
                name='SAAreaUnder',
                url='api/seasonagg',
                controller='droughtnp.api.getSeasonalAggregatedRatio'
            ),
            UrlMap(
                name='PercentageOfNormal',
                url='api/percentageOfNormal',
                controller='droughtnp.api.getPercentageOfNormal'
            ),
            UrlMap(
                name='forecast',
                url='api/getSpatialAverageForecast',
                controller='droughtnp.api.getSpatialAverageForecast'
            ),
        )

        return url_maps

